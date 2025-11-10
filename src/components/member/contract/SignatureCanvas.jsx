import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

/**
 * SignatureCanvas Component
 * Component để vẽ chữ ký trên canvas
 */
const SignatureCanvas = forwardRef(({ onSignatureChange, className = '' }, ref) => {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size based on container
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    setCanvasSize()

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const getPointFromEvent = (e) => {
      const rect = canvas.getBoundingClientRect()
      if (e.touches && e.touches.length > 0) {
        // Touch event
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        }
      } else {
        // Mouse event
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      }
    }

    const startDrawing = (e) => {
      e.preventDefault()
      const point = getPointFromEvent(e)
      isDrawingRef.current = true
      lastPointRef.current = point
    }

    const draw = (e) => {
      e.preventDefault()
      if (!isDrawingRef.current) return

      const point = getPointFromEvent(e)
      ctx.beginPath()
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()

      lastPointRef.current = point

      // Notify parent of signature change
      if (onSignatureChange) {
        onSignatureChange(canvas.toDataURL('image/png'))
      }
    }

    const stopDrawing = (e) => {
      e.preventDefault()
      if (isDrawingRef.current) {
        isDrawingRef.current = false
      }
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDrawing, { passive: false })
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false })

    // Handle window resize
    const handleResize = () => {
      setCanvasSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseleave', stopDrawing)
      canvas.removeEventListener('touchstart', startDrawing)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDrawing)
      canvas.removeEventListener('touchcancel', stopDrawing)
      window.removeEventListener('resize', handleResize)
    }
  }, [onSignatureChange])

  const clear = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (onSignatureChange) {
        onSignatureChange('')
      }
    }
  }

  const getDataURL = () => {
    const canvas = canvasRef.current
    return canvas ? canvas.toDataURL('image/png') : ''
  }

  const isEmpty = () => {
    const canvas = canvasRef.current
    if (!canvas) return true
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    // Check if canvas has any non-transparent pixels
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0) {
        return false
      }
    }
    return true
  }

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clear,
    getDataURL,
    isEmpty
  }), [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-48 border rounded bg-white cursor-crosshair ${className}`}
      style={{ touchAction: 'none' }}
    />
  )
})

SignatureCanvas.displayName = 'SignatureCanvas'

export default SignatureCanvas
