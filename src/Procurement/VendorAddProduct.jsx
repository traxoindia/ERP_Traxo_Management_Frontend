import React, { useState,useEffect } from "react";
import axios from "axios";
import VendorNavbar from "./VendorNavbar";

const VendorAddProduct = () => {
    const [form, setForm] = useState({
        product_name: "",
        category: "",
        sub_category: "",
        brand: "",
        model_number: "",
        price: "",
        quantity_available: "",
        minimum_order_quantity: "",
        description: "",
        vendor_id: "",
    });

    const [specifications, setSpecifications] = useState({
       specifications_details:""
    });

    const [features, setFeatures] = useState([""]);
    const [images, setImages] = useState([]);
    const [datasheet, setDatasheet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        const storedVendorId = localStorage.getItem("vendor_id");
        if (storedVendorId) {
            setForm((prev) => ({
                ...prev,
                vendor_id: storedVendorId,
            }));
        }
    }, []);
    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // Handle normal input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle specifications
    const handleSpecChange = (e) => {
        setSpecifications({
            ...specifications,
            [e.target.name]: e.target.value,
        });
    };

    // Handle features
    const handleFeatureChange = (index, value) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const addFeature = () => {
        setFeatures([...features, ""]);
    };

    const removeFeature = (index) => {
        const updated = features.filter((_, i) => i !== index);
        setFeatures(updated.length ? updated : [""]);
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // Remove image
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.product_name || !form.category || !form.price || !form.vendor_id) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // Append text fields
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });

            // JSON fields
            formData.append("specifications", JSON.stringify(specifications));
            formData.append("features", JSON.stringify(features.filter(f => f.trim())));

            // Multiple images
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            // Datasheet
            if (datasheet) {
                formData.append("datasheet", datasheet);
            }

            // API call to the correct endpoint
            const res = await axios.post(
                "https://api.traxoerp.com/vendor/products/add-product",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Success:", res.data);
            showToast("Product added successfully!", "success");

            // Reset form
            setForm({
                product_name: "",
                category: "",
                sub_category: "",
                brand: "",
                model_number: "",
                price: "",
                quantity_available: "",
                minimum_order_quantity: "",
                description: "",
                vendor_id: "",
            });
            setSpecifications({
               specifications_details:"",
            });
            setFeatures([""]);
            setImages([]);
            setImagePreviews([]);
            setDatasheet(null);

            // Reset file inputs
            e.target.reset();

        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            showToast(err.response?.data?.message || "Error adding product", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <VendorNavbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                {/* Toast Notification */}
                {toast.show && (
                    <div className={`fixed top-4 right-4 z-50 animate-slide-in ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: 'success' })}
                            className="ml-4 text-white hover:text-gray-200 text-xl"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Add New Product
                        </h1>
                        <p className="text-gray-600 mt-2">Fill in the product details below</p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 space-y-8">
                            {/* Basic Information Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">1</span>
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="product_name"
                                            value={form.product_name}
                                            onChange={handleChange}
                                            placeholder="e.g., Gaming Laptop"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Vendor ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="vendor_id"
                                            value={form.vendor_id}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            placeholder="e.g., Electronics"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                        <input
                                            type="text"
                                            name="sub_category"
                                            value={form.sub_category}
                                            onChange={handleChange}
                                            placeholder="e.g., Laptops"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={form.brand}
                                            onChange={handleChange}
                                            placeholder="e.g., Dell, HP, Apple"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                                        <input
                                            type="text"
                                            name="model_number"
                                            value={form.model_number}
                                            onChange={handleChange}
                                            placeholder="e.g., XPS 15 9520"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                                        <input
                                            type="number"
                                            name="quantity_available"
                                            value={form.quantity_available}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Quantity</label>
                                        <input
                                            type="number"
                                            name="minimum_order_quantity"
                                            value={form.minimum_order_quantity}
                                            onChange={handleChange}
                                            placeholder="1"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Detailed product description..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Specifications Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">2</span>
                                    Specifications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specifications Details</label>
                                        <textarea
                                            type="text"
                                           name="specifications_details"
                                           value={specifications.specifications_details}
                                            onChange={handleSpecChange}
                                            placeholder="e.g.,Specifications Details"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                   
                                </div>
                            </div>

                            {/* Features Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">3</span>
                                    Features
                                </h2>
                                <div className="space-y-3">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder={`Feature ${index + 1}`}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            />
                                            {features.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(index)}
                                                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                                    >
                                        + Add Feature
                                    </button>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">4</span>
                                    Product Images
                                </h2>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex flex-col items-center gap-2"
                                    >
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-600">Click to upload product images</span>
                                        <span className="text-sm text-gray-400">PNG, JPG, JPEG up to 5MB each</span>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Datasheet Section */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">5</span>
                                    Datasheet
                                </h2>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                    <input
                                        type="file"
                                        onChange={(e) => setDatasheet(e.target.files[0])}
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        id="datasheet-upload"
                                    />
                                    <label
                                        htmlFor="datasheet-upload"
                                        className="cursor-pointer inline-flex flex-col items-center gap-2"
                                    >
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-600">{datasheet ? datasheet.name : "Upload product datasheet"}</span>
                                        <span className="text-sm text-gray-400">PDF, DOC, DOCX up to 10MB</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({
                                        product_name: "",
                                        category: "",
                                        sub_category: "",
                                        brand: "",
                                        model_number: "",
                                        price: "",
                                        quantity_available: "",
                                        minimum_order_quantity: "",
                                        description: "",
                                        vendor_id: "",
                                    });
                                    setSpecifications({
                                       specifications_details:"",
                                    });
                                    setFeatures([""]);
                                    setImages([]);
                                    setImagePreviews([]);
                                    setDatasheet(null);
                                }}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Adding Product...
                                    </>
                                ) : (
                                    "Add Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Custom CSS for animations */}
                <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
            </div>
        </>
    );
};

export default VendorAddProduct;