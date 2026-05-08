import React, { useState, useEffect } from 'react'
import ProcurementNavbar from './ProcurementNavbar'

function ProcureMentSeeVendorProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
   
    

    try {
      const response = await fetch(`https://api.traxoerp.com/requirement/All-Vendor-Products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.')
        }
        if (response.status === 404) {
          throw new Error('Products endpoint not found.')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
      
      const productsData = result.products || result.data || result
      setProducts(Array.isArray(productsData) ? productsData : [])
      
    } catch (err) {
      setError(err.message)
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProduct && selectedProduct.media?.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.media.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProduct && selectedProduct.media?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.media.images.length - 1 : prev - 1
      )
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Products</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500">You haven't added any products yet.</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Your First Product
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
        <ProcurementNavbar/>
        <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">vendor Products</h1>
              <p className="text-gray-500 mt-1">Manage and view all your product listings</p>
            </div>
            <div className="text-sm text-gray-500">
              Total: <span className="font-semibold text-gray-700">{products.length}</span> products
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Image Container */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {product.media?.images && product.media.images.length > 0 ? (
                  <img 
                    src={product.media.images[0]} 
                    alt={product.basic_info?.product_name || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(product.status)}`}>
                    {product.status || 'DRAFT'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                  {product.basic_info?.product_name || 'Unnamed Product'}
                </h3>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{product.basic_info?.brand || 'No brand'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    <span className="text-gray-600">{product.basic_info?.model_number || 'No model'}</span>
                  </div>
                </div>

                <div className="border-t pt-3 mb-3">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.pricing?.price?.toLocaleString() || '0'}
                    </span>
                    <span className={`text-sm font-medium ${(product.pricing?.quantity_available || 0) <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      Stock: {product.pricing?.quantity_available || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedProduct.basic_info?.product_name || 'Product Details'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Product ID: {selectedProduct._id}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Images */}
                <div>
                  {selectedProduct.media?.images && selectedProduct.media.images.length > 0 ? (
                    <div>
                      <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
                        <img 
                          src={selectedProduct.media.images[currentImageIndex]} 
                          alt={`Product view ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        
                        {selectedProduct.media.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      
                      {selectedProduct.media.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedProduct.media.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No images available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Status & Meta */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedProduct.status)}`}>
                      {selectedProduct.status || 'DRAFT'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Price</p>
                        <p className="text-3xl font-bold text-green-600">
                          ${selectedProduct.pricing?.price?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Stock Status</p>
                        <p className={`text-lg font-semibold ${(selectedProduct.pricing?.quantity_available || 0) <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedProduct.pricing?.quantity_available || 0} units
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Min Order: {selectedProduct.pricing?.minimum_order_quantity || 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Brand</p>
                        <p className="font-medium text-gray-800">{selectedProduct.basic_info?.brand || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Model Number</p>
                        <p className="font-medium text-gray-800">{selectedProduct.basic_info?.model_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium text-gray-800">{selectedProduct.basic_info?.category || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sub Category</p>
                        <p className="font-medium text-gray-800">{selectedProduct.basic_info?.sub_category || 'N/A'}</p>
                      </div>
                    </div>
                    {selectedProduct.basic_info?.description && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm">Description</p>
                        <p className="text-gray-700 text-sm mt-1">{selectedProduct.basic_info.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).filter(key => selectedProduct.specifications[key]).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 8h10M8 11h10" />
                        </svg>
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedProduct.specifications.processor && (
                          <div>
                            <p className="text-gray-500">Processor</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.processor}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.ram && (
                          <div>
                            <p className="text-gray-500">RAM</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.ram}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.storage && (
                          <div>
                            <p className="text-gray-500">Storage</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.storage}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.graphics && (
                          <div>
                            <p className="text-gray-500">Graphics</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.graphics}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.display && (
                          <div>
                            <p className="text-gray-500">Display</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.display}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.battery && (
                          <div>
                            <p className="text-gray-500">Battery</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.battery}</p>
                          </div>
                        )}
                        {selectedProduct.specifications.os && (
                          <div>
                            <p className="text-gray-500">OS</p>
                            <p className="font-medium text-gray-800">{selectedProduct.specifications.os}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Features
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.features.map((feature, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {selectedProduct.media?.documents?.datasheet && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Documentation
                      </h3>
                      <a 
                        href={selectedProduct.media.documents.datasheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Datasheet
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default ProcureMentSeeVendorProducts