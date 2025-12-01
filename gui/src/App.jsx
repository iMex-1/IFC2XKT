import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
    const [files, setFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [converting, setConverting] = useState(false)
    const [progress, setProgress] = useState({})
    const [completedCount, setCompletedCount] = useState(0)
    const [outputPath, setOutputPath] = useState('')
    const [showSettings, setShowSettings] = useState(false)

    // Load saved output path
    useEffect(() => {
        const saved = localStorage.getItem('outputPath')
        if (saved) {
            setOutputPath(saved)
        }
    }, [])

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            file => file.name.toLowerCase().endsWith('.ifc')
        )

        addFiles(droppedFiles)
    }

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            file => file.name.toLowerCase().endsWith('.ifc')
        )
        addFiles(selectedFiles)
    }

    const addFiles = (newFiles) => {
        const fileObjects = newFiles.map(file => ({
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            status: 'pending'
        }))
        setFiles(prev => [...prev, ...fileObjects])
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const selectOutputFolder = async () => {
        if (window.electron) {
            const result = await window.electron.selectOutputFolder()
            if (result.path) {
                setOutputPath(result.path)
                localStorage.setItem('outputPath', result.path)

                // Update server's output path
                try {
                    await fetch('http://127.0.0.1:3001/api/output-path', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: result.path })
                    })
                } catch (error) {
                    console.error('Failed to update server output path:', error.message)
                }
            }
        } else {
            // For web version, use a text input
            const path = prompt('Enter output folder path:', outputPath)
            if (path) {
                setOutputPath(path)
                localStorage.setItem('outputPath', path)

                // Update server's output path
                try {
                    await fetch('http://127.0.0.1:3001/api/output-path', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: path })
                    })
                } catch (error) {
                    console.error('Failed to update server output path:', error.message)
                }
            }
        }
    }

    const convertFiles = async () => {
        if (files.length === 0) return

        setConverting(true)
        setCompletedCount(0)

        for (let i = 0; i < files.length; i++) {
            const fileObj = files[i]

            setProgress(prev => ({ ...prev, [i]: 'converting' }))

            const formData = new FormData()
            formData.append('file', fileObj.file)
            if (outputPath) {
                formData.append('outputPath', outputPath)
            }

            try {
                const response = await fetch('http://127.0.0.1:3001/api/convert', {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log('Conversion successful:', data)
                    setProgress(prev => ({ ...prev, [i]: 'completed' }))
                    setCompletedCount(prev => prev + 1)
                } else {
                    const errorData = await response.json()
                    console.error('Conversion failed:', errorData)
                    setProgress(prev => ({ ...prev, [i]: 'error' }))
                    setCompletedCount(prev => prev + 1)
                }
            } catch (error) {
                console.error('Conversion error:', error.message, error)
                setProgress(prev => ({ ...prev, [i]: 'error' }))
                setCompletedCount(prev => prev + 1)
            }
        }

        setConverting(false)
    }

    const openOutputDirectory = async () => {
        try {
            if (window.electron) {
                await window.electron.openOutputFolder()
            } else {
                const response = await fetch('/api/open-output', {
                    method: 'POST'
                })
                if (!response.ok) {
                    console.error('Failed to open directory')
                }
            }
        } catch (error) {
            console.error('Error opening directory:', error)
        }
    }

    const clearAll = () => {
        setFiles([])
        setProgress({})
        setCompletedCount(0)
    }

    const progressPercentage = files.length > 0 ? (completedCount / files.length) * 100 : 0

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="header-title">
                        <div>
                            <h1>IFC2XKT</h1>
                            <p className="header-subtitle">Convert IFC files to XKT format</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn-settings"
                            onClick={() => setShowSettings(!showSettings)}
                            title="Settings"
                        >
                            ⚙️
                        </button>
                        <button
                            className="btn-open-output"
                            onClick={openOutputDirectory}
                        >
                            <span>📁</span>
                            <span>Open Output</span>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        className="settings-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="settings-content">
                            <h3>Settings</h3>
                            <div className="setting-item">
                                <label>Output Folder</label>
                                <div className="output-path-selector">
                                    <input
                                        type="text"
                                        value={outputPath || 'Default (project folder)'}
                                        readOnly
                                        className="output-path-input"
                                    />
                                    <button
                                        className="btn-select-folder"
                                        onClick={selectOutputFolder}
                                    >
                                        Browse
                                    </button>
                                </div>
                                <p className="setting-description">
                                    Choose where converted XKT files will be saved
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="main-content">
                <motion.div
                    className={`dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <input
                        id="fileInput"
                        type="file"
                        multiple
                        accept=".ifc"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                    <div className="dropzone-content">
                        <motion.svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </motion.svg>
                        <h3>Drop IFC files here</h3>
                        <p>or click to browse your files</p>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {files.length > 0 && (
                        <motion.div
                            className="files-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="files-header">
                                <h3>{files.length} {files.length === 1 ? 'File' : 'Files'}</h3>
                                <button className="btn-clear" onClick={clearAll}>Clear All</button>
                            </div>

                            <AnimatePresence>
                                {converting && (
                                    <motion.div
                                        className="overall-progress"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="progress-info">
                                            <span className="progress-text">Converting files...</span>
                                            <span className="progress-count">{completedCount} / {files.length}</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <motion.div
                                                className="progress-bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercentage}%` }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="files-list">
                                <AnimatePresence>
                                    {files.map((fileObj, index) => (
                                        <motion.div
                                            key={index}
                                            className="file-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <div className="file-icon">📄</div>
                                            <div className="file-info">
                                                <div className="file-name">{fileObj.name}</div>
                                                <div className="file-size">{fileObj.size}</div>
                                            </div>
                                            <div className="file-status">
                                                {progress[index] === 'converting' && (
                                                    <motion.span
                                                        className="status converting"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                    >
                                                        Converting
                                                    </motion.span>
                                                )}
                                                {progress[index] === 'completed' && (
                                                    <motion.span
                                                        className="status completed"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                    >
                                                        Done
                                                    </motion.span>
                                                )}
                                                {progress[index] === 'error' && (
                                                    <motion.span
                                                        className="status error"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                    >
                                                        Error
                                                    </motion.span>
                                                )}
                                                {!progress[index] && !converting && (
                                                    <motion.button
                                                        className="btn-remove"
                                                        onClick={() => removeFile(index)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        ×
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="action-footer">
                                <motion.button
                                    className="btn-convert"
                                    onClick={convertFiles}
                                    disabled={converting}
                                    whileHover={{ scale: converting ? 1 : 1.02 }}
                                    whileTap={{ scale: converting ? 1 : 0.98 }}
                                >
                                    {converting ? 'Converting...' : `Convert ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

export default App
