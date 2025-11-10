import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * SearchBar Component
 * Search input với autocomplete (có thể mở rộng sau)
 */
export default function SearchBar({ onSearch, placeholder = 'Tìm kiếm sản phẩm...', className = '' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef(null)

  // Sync với URL params
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || ''
    setKeyword(urlKeyword)
  }, [searchParams])

  const handleSearch = (e) => {
    e?.preventDefault()
    
    if (isSearching) return

    setIsSearching(true)
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (keyword.trim()) {
      newParams.set('keyword', keyword.trim())
      newParams.set('pageNumber', '1') // Reset to first page
    } else {
      newParams.delete('keyword')
    }
    
    setSearchParams(newParams)

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(keyword.trim())
    }

    // Navigate to search page if not already there
    if (window.location.pathname !== '/search') {
      navigate(`/search?${newParams.toString()}`)
    }

    setTimeout(() => setIsSearching(false), 300)
  }

  const handleClear = () => {
    setKeyword('')
    inputRef.current?.focus()
    
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('keyword')
    newParams.set('pageNumber', '1')
    setSearchParams(newParams)

    if (onSearch) {
      onSearch('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 h-12 text-base"
        />
        {keyword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSearching}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Tìm kiếm'
          )}
        </Button>
      </div>
    </form>
  )
}


