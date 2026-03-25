"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function SearchDialog({ isOpen, onClose, searchQuery, onSearchQueryChange }: SearchDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky max-w-5xl mx-auto top-0 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-lg"
                autoFocus
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Image Search Section */}
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // Handle image upload for search
                    console.log('Image selected for search:', file.name)
                  }
                }}
              />
              <label htmlFor="image-upload" className="cursor-pointer flex items-center space-x-2 hover:text-foreground">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Image</span>
              </label>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Search by image to find similar products
          </p>
        </div>
      </div>

      {/* Search Results Area */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {searchQuery ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Search results for: <span className="font-medium">{searchQuery}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample search results */}
                {['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 6'].map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-200 rounded mb-2"></div>
                    <h3 className="font-medium">{product}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Product description</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Search for products</h2>
              <p className="text-muted-foreground">Enter a search term or upload an image to find products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
