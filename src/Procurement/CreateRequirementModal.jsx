import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";

const CreateRequirementModal = ({ isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  
  // State for filtered products based on category
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    product_Name: "",
    category: "",
    company_Name: "Traxo India Automation Private Limited",
    status: "open"
  });

  // Fetch all vendor products when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllVendorProducts();
    }
  }, [isOpen]);

  const fetchAllVendorProducts = async () => {
    setFetchingProducts(true);
    try {
      const response = await fetch(`https://api.traxoerp.com/requirement/All-Vendor-Products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Fetched products:", result);
      
      // Extract products array from response
      const productsData = result.products || result.data || result;
      setProducts(Array.isArray(productsData) ? productsData : []);
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(productsData.map(product => product.basic_info?.category).filter(Boolean))];
      console.log("Unique categories:", uniqueCategories);
      
    } catch (err) {
      console.error("Error fetching products:", err);
      showToast("Failed to load products", "error");
    } finally {
      setFetchingProducts(false);
    }
  };

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = products
      .map(product => product.basic_info?.category)
      .filter(category => category && category.trim() !== "");
    return [...new Set(categories)];
  };

  // Get products by selected category
  const getProductsByCategory = (category) => {
    if (!category) return [];
    return products.filter(product => product.basic_info?.category === category);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ 
      ...formData, 
      category: selectedCategory,
      product_Name: "" // Reset product name when category changes
    });
    
    // Filter products based on selected category
    const productsInCategory = getProductsByCategory(selectedCategory);
    setFilteredProducts(productsInCategory);
  };

  // Handle product name change
  const handleProductNameChange = (e) => {
    const selectedProductName = e.target.value;
    setFormData({ ...formData, product_Name: selectedProductName });
    
    // Optionally auto-fill other details from selected product
    const selectedProduct = filteredProducts.find(
      product => product.basic_info?.product_name === selectedProductName
    );
    
    if (selectedProduct && !formData.title) {
      // Auto-fill title if empty
      setFormData(prev => ({
        ...prev,
        title: selectedProduct.basic_info?.product_name || prev.title
      }));
    }
  };

  if (!isOpen) return null;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      showToast("Please enter requirement title", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Please enter description", "error");
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      showToast("Please enter valid quantity", "error");
      return;
    }
    if (!formData.product_Name.trim()) {
      showToast("Please select product name", "error");
      return;
    }
    if (!formData.category.trim()) {
      showToast("Please select category", "error");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: formData.title,
      description: formData.description,
      quantity: Number(formData.quantity),
      product_Name: formData.product_Name,
      category: formData.category,
      company_Name: formData.company_Name,
      status: formData.status,
      created_at: new Date().toISOString()
    };

    try {
      const response = await axios.post(
        "https://api.traxoerp.com/requirement/create-requirement",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data) {
        setSuccess(true);
        showToast("Requirement posted successfully!", "success");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          quantity: "",
          product_Name: "",
          category: "",
          company_Name: "Traxo India Automation Private Limited",
          status: "open"
        });
        setFilteredProducts([]);
        
        // Close modal after delay
        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onRefresh) onRefresh();
        }, 2000);
      }
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to create requirement. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = getUniqueCategories();

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-[200] animate-in slide-in-from-top-2 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
          
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Requirement</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to post a procurement requirement</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Loading Products Indicator */}
            {fetchingProducts && (
              <div className="flex items-center gap-2 p-3 text-sm text-blue-600 bg-blue-50 rounded-xl border border-blue-100">
                <Loader2 size={16} className="animate-spin" />
                <span>Loading available products...</span>
              </div>
            )}

            {/* Error Banner */}
            {error && !toast.show && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle2 size={16} />
                Requirement posted successfully! Redirecting...
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Requirement Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., GPS Tracker Requirement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading || success || fetchingProducts}
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                value={formData.category}
                onChange={handleCategoryChange}
                disabled={loading || success || fetchingProducts || uniqueCategories.length === 0}
              >
                <option value="">Select Category</option>
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {uniqueCategories.length === 0 && !fetchingProducts && (
                <p className="text-xs text-amber-600 mt-1">No categories available. Please check products.</p>
              )}
            </div>

            {/* Product Name Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                value={formData.product_Name}
                onChange={handleProductNameChange}
                disabled={loading || success || !formData.category || filteredProducts.length === 0}
              >
                <option value="">Select Product</option>
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product.basic_info?.product_name}>
                    {product.basic_info?.product_name} - {product.basic_info?.brand} (Stock: {product.pricing?.quantity_available})
                  </option>
                ))}
              </select>
              {formData.category && filteredProducts.length === 0 && !fetchingProducts && (
                <p className="text-xs text-amber-600 mt-1">No products available in this category.</p>
              )}
            </div>

            {/* Quantity & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="50"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  disabled={loading || success}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={loading || success}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Company Name"
                value={formData.company_Name}
                onChange={(e) => setFormData({ ...formData, company_Name: e.target.value })}
                disabled={loading || success}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                placeholder="Need high quality GPS tracking devices for vehicle monitoring and live tracking system..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading || success}
              ></textarea>
              <p className="text-xs text-gray-400 ml-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Selected Product Preview (Optional) */}
            {formData.product_Name && filteredProducts.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">Selected Product Details:</p>
                {(() => {
                  const selectedProduct = filteredProducts.find(
                    p => p.basic_info?.product_name === formData.product_Name
                  );
                  return selectedProduct ? (
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Brand:</span> {selectedProduct.basic_info?.brand}</p>
                      <p><span className="text-gray-600">Model:</span> {selectedProduct.basic_info?.model_number}</p>
                      <p><span className="text-gray-600">Available Stock:</span> {selectedProduct.pricing?.quantity_available}</p>
                      <p><span className="text-gray-600">Price:</span> ${selectedProduct.pricing?.price}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success || fetchingProducts}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Requirement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRequirementModal;