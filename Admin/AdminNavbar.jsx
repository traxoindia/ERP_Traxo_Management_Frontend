import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, UserCircle, Plus, X, Building2, Globe, Mail, Phone, 
  MapPin, Briefcase, Users, CreditCard, Hash, ShieldCheck, Landmark, 
  Loader2, LogOut, ChevronDown, User, Calendar, Layers, Trash2,
  Home, Menu, ChevronLeft, TrendingUp, Clock, Settings, HelpCircle,
  AlertCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- API CONFIGURATION ---
const API_BASE_URL = 'https://python-backend-2-5uar.onrender.com';

const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
  },
});

// --- REUSABLE COMPONENTS ---
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
    <Icon size={18} className="text-blue-600" />
    <h3 className="font-bold text-gray-800 uppercase tracking-wider text-xs">{title}</h3>
  </div>
);

const InputField = ({ icon: Icon, section, field, placeholder, formData, handleInputChange, type = "text", required = true, error }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 z-10">
      <Icon size={16} />
    </div>
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={formData[section][field]}
      onChange={(e) => handleInputChange(section, field, e.target.value)}
      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const SelectField = ({ icon: Icon, section, field, placeholder, formData, handleInputChange, options, required = true }) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 z-10">
      <Icon size={16} />
    </div>
    <select
      required={required}
      value={formData[section][field]}
      onChange={(e) => handleInputChange(section, field, e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const Card = ({ children, className = "", hover = false }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-300' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, loading, onClick, className = "", disabled, type = "button" }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-black to-yellow-500 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/25',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600',
    ghost: 'hover:bg-gray-100 text-gray-600',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {Icon && !loading && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- CUSTOM HOOKS ---
const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/company/get-companies`, getAuthHeaders());
      setCompanies(res.data.companies || []);
      toast.success(`Loaded ${res.data.companies?.length || 0} companies`);
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompanies(); }, []);
  return { companies, loading, refetch: fetchCompanies };
};

const useBranches = (companyId) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    if (!companyId) { setBranches([]); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/branches/get-by-company`, 
        { company_id: companyId }, getAuthHeaders()
      );
      setBranches(res.data.branches || []);
      toast.success(`Loaded ${res.data.branches?.length || 0} branches`);
    } catch (err) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, [companyId]);
  return { branches, loading, refetch: fetchBranches };
};

const useDepartments = (branchId) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    if (!branchId) { setDepartments([]); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/departments/get-by-branch`,
        { branch_id: branchId }, getAuthHeaders()
      );
      setDepartments(res.data.departments || []);
      toast.success(`Loaded ${res.data.departments?.length || 0} departments`);
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, [branchId]);
  return { departments, loading, refetch: fetchDepartments };
};

// --- MAIN COMPONENT ---
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Modal states
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  
  // Data states
  const { companies, refetch: refetchCompanies } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const { branches, refetch: refetchBranches } = useBranches(selectedCompanyId);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const { departments, refetch: refetchDepartments } = useDepartments(selectedBranchId);
  
  // Form states
  const [newBranch, setNewBranch] = useState({ name: '', location: '' });
  const [newDepartment, setNewDepartment] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyInfo: { 
      companyName: '', 
      legalName: '', 
      companyType: '', 
      industry: '', 
      yearOfIncorporation: '', 
      numberOfEmployees: '' 
    },
    address: { 
      registeredAddress: '', 
      operationalAddress: '', 
      city: '', 
      state: '', 
      country: '', 
      pinCode: '' 
    },
    contact: { 
      email: '', 
      phone: '', 
      website: '' 
    },
    authorizedPerson: { 
      fullName: '', 
      designation: '', 
      email: '', 
      phone: '', 
      idProofNumber: '' 
    },
    bankDetails: { 
      bankName: '', 
      accountHolderName: '', 
      accountNumber: '', 
      ifscCode: '', 
      branchName: '' 
    },
    taxInformation: { 
      pan: '', 
      gst: '', 
      cin: '', 
      tan: '' 
    }
  });

  // Company Types and Industries options
  const companyTypes = [
    { value: 'Private Limited', label: 'Private Limited' },
    { value: 'Public Limited', label: 'Public Limited' },
    { value: 'LLP', label: 'LLP' },
    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Non-Profit', label: 'Non-Profit' }
  ];

  const industries = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Transportation', label: 'Transportation' }
  ];

  const countries = [
    { value: 'India', label: 'India' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' }
  ];

  // Stats calculation
  const stats = [
    // { title: 'Total Companies', value: companies.length, icon: Building2, color: 'blue', trend: '+12% this month' },
    // { title: 'Total Branches', value: branches.length, icon: MapPin, color: 'green', trend: '+5 new' },
    // { title: 'Departments', value: departments.length, icon: Layers, color: 'purple', trend: '+8 active' },
    // { title: 'Growth Rate', value: '24%', icon: TrendingUp, color: 'orange', trend: '+6% vs last month' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    toast.success('Logged out successfully! 👋');
    navigate('/admin/login');
  };

  const validateForm = () => {
    const errors = {};
    
    // Company Info Validation
    if (!formData.companyInfo.companyName) errors.companyName = 'Company name is required';
    if (!formData.companyInfo.legalName) errors.legalName = 'Legal name is required';
    if (!formData.companyInfo.companyType) errors.companyType = 'Company type is required';
    if (!formData.companyInfo.industry) errors.industry = 'Industry is required';
    if (!formData.companyInfo.yearOfIncorporation) errors.yearOfIncorporation = 'Year of incorporation is required';
    if (!formData.companyInfo.numberOfEmployees) errors.numberOfEmployees = 'Number of employees is required';
    
    // Address Validation
    if (!formData.address.registeredAddress) errors.registeredAddress = 'Registered address is required';
    if (!formData.address.city) errors.city = 'City is required';
    if (!formData.address.state) errors.state = 'State is required';
    if (!formData.address.country) errors.country = 'Country is required';
    if (!formData.address.pinCode) errors.pinCode = 'PIN code is required';
    
    // Contact Validation
    if (!formData.contact.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.contact.phone) errors.phone = 'Phone number is required';
    
    // Authorized Person Validation
    if (!formData.authorizedPerson.fullName) errors.fullName = 'Full name is required';
    if (!formData.authorizedPerson.designation) errors.designation = 'Designation is required';
    if (!formData.authorizedPerson.email) {
      errors.authEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.authorizedPerson.email)) {
      errors.authEmail = 'Invalid email format';
    }
    if (!formData.authorizedPerson.phone) errors.authPhone = 'Phone number is required';
    if (!formData.authorizedPerson.idProofNumber) errors.idProofNumber = 'ID proof number is required';
    
    // Bank Details Validation
    if (!formData.bankDetails.bankName) errors.bankName = 'Bank name is required';
    if (!formData.bankDetails.accountHolderName) errors.accountHolderName = 'Account holder name is required';
    if (!formData.bankDetails.accountNumber) errors.accountNumber = 'Account number is required';
    if (!formData.bankDetails.ifscCode) errors.ifscCode = 'IFSC code is required';
    
    // Tax Information Validation
    if (!formData.taxInformation.pan) errors.pan = 'PAN number is required';
    if (!formData.taxInformation.gst) errors.gst = 'GST number is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields! ❌');
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading('Onboarding company... Please wait');
    
    try {
      await axios.post(`${API_BASE_URL}/company/onboard`, formData, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Company onboarded successfully! 🎉');
      setShowCompanyModal(false);
      refetchCompanies();
      
      // Reset form
      setFormData({
        companyInfo: { companyName: '', legalName: '', companyType: '', industry: '', yearOfIncorporation: '', numberOfEmployees: '' },
        address: { registeredAddress: '', operationalAddress: '', city: '', state: '', country: '', pinCode: '' },
        contact: { email: '', phone: '', website: '' },
        authorizedPerson: { fullName: '', designation: '', email: '', phone: '', idProofNumber: '' },
        bankDetails: { bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', branchName: '' },
        taxInformation: { pan: '', gst: '', cin: '', tan: '' }
      });
      setValidationErrors({});
      
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMsg = err.response?.data?.detail || 'Onboarding failed. Please try again.';
      toast.error(errorMsg);
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      toast.error('Please select a company first!');
      return;
    }
    if (!newBranch.name || !newBranch.location) {
      toast.error('Please fill all branch fields!');
      return;
    }
    
    const loadingToast = toast.loading('Creating branch...');
    try {
      await axios.post(`${API_BASE_URL}/branches/`, {
        name: newBranch.name,
        location: newBranch.location,
        company_id: selectedCompanyId
      }, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Branch created successfully! 🎉');
      setNewBranch({ name: '', location: '' });
      setShowBranchModal(false);
      refetchBranches();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create branch');
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!selectedBranchId) {
      toast.error('Please select a branch first!');
      return;
    }
    if (!newDepartment.name) {
      toast.error('Please enter department name!');
      return;
    }
    
    const loadingToast = toast.loading('Creating department...');
    try {
      await axios.post(`${API_BASE_URL}/departments/create`, {
        name: newDepartment.name,
        branch_id: selectedBranchId
      }, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Department created successfully! 🎉');
      setNewDepartment({ name: '' });
      setShowDeptModal(false);
      refetchDepartments();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create department');
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    
    const loadingToast = toast.loading('Deleting branch...');
    try {
      await axios.delete(`${API_BASE_URL}/branches/?branch_id=${branchId}`, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Branch deleted successfully! 🗑️');
      refetchBranches();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete branch');
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    const loadingToast = toast.loading('Deleting department...');
    try {
      await axios.delete(`${API_BASE_URL}/departments/?department_id=${deptId}`, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Department deleted successfully! 🗑️');
      refetchDepartments();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete department');
    }
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'branches', label: 'Branches', icon: MapPin },
    { id: 'departments', label: 'Departments', icon: Layers },
  ];

  // Dashboard View Component
  const DashboardView = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-black to-yellow-500 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
            <p className="text-blue-100">Here's what's happening with your organization today.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Clock size={24} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100">Active Companies</p>
            <p className="text-2xl font-bold">{companies.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100">Total Branches</p>
            <p className="text-2xl font-bold">{branches.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100">Departments</p>
            <p className="text-2xl font-bold">{departments.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm text-blue-100">Growth Rate</p>
            <p className="text-2xl font-bold">+24%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" icon={Building2} onClick={() => setShowCompanyModal(true)} className="w-full justify-start">
              Add New Company
            </Button>
            <Button variant="outline" icon={MapPin} onClick={() => setShowBranchModal(true)} className="w-full justify-start">
              Create Branch
            </Button>
            <Button variant="outline" icon={Layers} onClick={() => setShowDeptModal(true)} className="w-full justify-start">
              Add Department
            </Button>
          </div>
        </Card>

       
      </div>
    </div>
  );

  // Companies View Component
  const CompaniesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1">Manage and oversee all registered enterprises</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCompanyModal(true)}>
          Add Company
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Card key={company._id} hover className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-black to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 size={22} className="text-white" />
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{company.companyInfo?.companyName}</h3>
              <p className="text-sm text-gray-500">{company.companyInfo?.industry || 'Not specified'}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{company.address?.city}, {company.address?.state}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>{company.contact?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{company.contact?.phone}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No companies found</p>
          <Button variant="outline" icon={Plus} onClick={() => setShowCompanyModal(true)} className="mt-4">
            Add Your First Company
          </Button>
        </Card>
      )}
    </div>
  );

  // Branches View Component
  const BranchesView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-500 mt-1">Manage branch locations across your organization</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="">Filter by company</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.companyInfo?.companyName}</option>
            ))}
          </select>
          <Button icon={Plus} onClick={() => setShowBranchModal(true)}>
            Add Branch
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Branch Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Branch ID</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branches.map(branch => (
                <tr key={branch._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin size={14} className="text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{branch.location}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{branch._id?.slice(-8)}</code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteBranch(branch._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {branches.length === 0 && (
          <div className="p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {selectedCompanyId ? 'No branches found for this company' : 'Select a company to view branches'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );

  // Departments View Component
  const DepartmentsView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">Manage organizational departments and teams</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="">Select company</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.companyInfo?.companyName}</option>
            ))}
          </select>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            disabled={!selectedCompanyId}
          >
            <option value="">Select branch</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name} - {b.location}</option>
            ))}
          </select>
          <Button icon={Plus} onClick={() => setShowDeptModal(true)} disabled={!selectedBranchId}>
            Add Department
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <Card key={dept._id} hover className="group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers size={20} className="text-white" />
                </div>
                <button
                  onClick={() => handleDeleteDepartment(dept._id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{dept.name}</h3>
              <p className="text-xs text-gray-400 font-mono mt-2">ID: {dept._id?.slice(-8)}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card className="p-12 text-center">
          <Layers size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            {selectedBranchId ? 'No departments found for this branch' : 'Select a branch to view departments'}
          </p>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 4000, 
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'white' } }
        }} 
      />
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`h-16 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 border-b border-gray-700`}>
          {!sidebarCollapsed && <span className="text-xl font-bold text-black bg-clip-text text-transparent">Admin</span>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            {sidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-black to-yellow-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-900 hover:bg-yellow-500'
              }`}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span className="font-medium flex-1 text-left">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 space-y-2">
          
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Navbar */}
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    AD
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <User size={16} /> Profile Settings
                      </button>
                      <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <HelpCircle size={16} /> Help Center
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        {/* Page Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'companies' && <CompaniesView />}
          {activeTab === 'branches' && <BranchesView />}
          {activeTab === 'departments' && <DepartmentsView />}
        </div>
      </main>
      
      {/* ONBOARDING MODAL - WITH ALL FIELDS REQUIRED */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCompanyModal(false)}></div>

          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Company Onboarding</h2>
                <p className="text-sm text-gray-500 mt-1">All fields marked with * are required</p>
              </div>
              <button onClick={() => setShowCompanyModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleOnboard} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Company Identity Section */}
                <section>
                  <SectionHeader icon={Building2} title="Company Identity *" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <InputField 
                        icon={Building2} 
                        section="companyInfo" 
                        field="companyName" 
                        placeholder="Brand Name *" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                        error={validationErrors.companyName}
                        required
                      />
                    </div>
                    <InputField 
                      icon={ShieldCheck} 
                      section="companyInfo" 
                      field="legalName" 
                      placeholder="Legal Entity Name *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.legalName}
                      required
                    />
                    <SelectField
                      icon={Briefcase}
                      section="companyInfo"
                      field="companyType"
                      placeholder="Company Type *"
                      formData={formData}
                      handleInputChange={handleInputChange}
                      options={companyTypes}
                      required
                    />
                    <SelectField
                      icon={Globe}
                      section="companyInfo"
                      field="industry"
                      placeholder="Industry *"
                      formData={formData}
                      handleInputChange={handleInputChange}
                      options={industries}
                      required
                    />
                    <InputField 
                      icon={Calendar} 
                      section="companyInfo" 
                      field="yearOfIncorporation" 
                      placeholder="Est. Year *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.yearOfIncorporation}
                      required
                    />
                    <div className="col-span-2">
                      <InputField 
                        icon={Users} 
                        section="companyInfo" 
                        field="numberOfEmployees" 
                        placeholder="Headcount *" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                        error={validationErrors.numberOfEmployees}
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Address Section */}
                <section>
                  <SectionHeader icon={MapPin} title="Global Presence *" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <InputField 
                        icon={MapPin} 
                        section="address" 
                        field="registeredAddress" 
                        placeholder="Registered Address *" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                        error={validationErrors.registeredAddress}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <InputField 
                        icon={MapPin} 
                        section="address" 
                        field="operationalAddress" 
                        placeholder="Operational Address" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                      />
                    </div>
                    <InputField 
                      icon={MapPin} 
                      section="address" 
                      field="city" 
                      placeholder="City *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.city}
                      required
                    />
                    <InputField 
                      icon={MapPin} 
                      section="address" 
                      field="state" 
                      placeholder="State *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.state}
                      required
                    />
                    <SelectField
                      icon={Globe}
                      section="address"
                      field="country"
                      placeholder="Country *"
                      formData={formData}
                      handleInputChange={handleInputChange}
                      options={countries}
                      required
                    />
                    <InputField 
                      icon={Hash} 
                      section="address" 
                      field="pinCode" 
                      placeholder="PIN Code *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.pinCode}
                      required
                    />
                  </div>
                </section>

                {/* Communication Section */}
                <section>
                  <SectionHeader icon={Mail} title="Communication *" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      icon={Mail} 
                      section="contact" 
                      field="email" 
                      placeholder="Corporate Email *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.email}
                      type="email"
                      required
                    />
                    <InputField 
                      icon={Phone} 
                      section="contact" 
                      field="phone" 
                      placeholder="Business Phone *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.phone}
                      required
                    />
                    <div className="col-span-2">
                      <InputField 
                        icon={Globe} 
                        section="contact" 
                        field="website" 
                        placeholder="Website URL" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                      />
                    </div>
                  </div>
                </section>

                {/* Authorized Representative Section */}
                <section>
                  <SectionHeader icon={UserCircle} title="Authorized Representative *" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      icon={UserCircle} 
                      section="authorizedPerson" 
                      field="fullName" 
                      placeholder="Full Name *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.fullName}
                      required
                    />
                    <InputField 
                      icon={Briefcase} 
                      section="authorizedPerson" 
                      field="designation" 
                      placeholder="Designation *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.designation}
                      required
                    />
                    <InputField 
                      icon={Mail} 
                      section="authorizedPerson" 
                      field="email" 
                      placeholder="Direct Email *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.authEmail}
                      type="email"
                      required
                    />
                    <InputField 
                      icon={Phone} 
                      section="authorizedPerson" 
                      field="phone" 
                      placeholder="Mobile Number *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.authPhone}
                      required
                    />
                    <div className="col-span-2">
                      <InputField 
                        icon={ShieldCheck} 
                        section="authorizedPerson" 
                        field="idProofNumber" 
                        placeholder="ID Proof Number *" 
                        formData={formData} 
                        handleInputChange={handleInputChange}
                        error={validationErrors.idProofNumber}
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Banking Details Section */}
                <section>
                  <SectionHeader icon={Landmark} title="Banking Details *" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      icon={Landmark} 
                      section="bankDetails" 
                      field="bankName" 
                      placeholder="Bank Name *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.bankName}
                      required
                    />
                    <InputField 
                      icon={UserCircle} 
                      section="bankDetails" 
                      field="accountHolderName" 
                      placeholder="Holder Name *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.accountHolderName}
                      required
                    />
                    <InputField 
                      icon={CreditCard} 
                      section="bankDetails" 
                      field="accountNumber" 
                      placeholder="Account Number *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.accountNumber}
                      required
                    />
                    <InputField 
                      icon={Hash} 
                      section="bankDetails" 
                      field="ifscCode" 
                      placeholder="IFSC Code *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.ifscCode}
                      required
                    />
                  </div>
                </section>

                {/* Tax Information Section */}
                <section>
                  <SectionHeader icon={Hash} title="Tax Information *" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      icon={Hash} 
                      section="taxInformation" 
                      field="pan" 
                      placeholder="PAN *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.pan}
                      required
                    />
                    <InputField 
                      icon={Hash} 
                      section="taxInformation" 
                      field="gst" 
                      placeholder="GST *" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                      error={validationErrors.gst}
                      required
                    />
                    <InputField 
                      icon={Hash} 
                      section="taxInformation" 
                      field="cin" 
                      placeholder="CIN" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                    />
                    <InputField 
                      icon={Hash} 
                      section="taxInformation" 
                      field="tan" 
                      placeholder="TAN" 
                      formData={formData} 
                      handleInputChange={handleInputChange}
                    />
                  </div>
                </section>
              </div>

              <div className="mt-10 sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompanyModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                    loading
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Onboarding'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBranchModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Branch</h2>
                <p className="text-sm text-gray-500">Add a new branch location</p>
              </div>
              <button onClick={() => setShowBranchModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBranch} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Company *</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map(c => (
                    <option key={c._id} value={c._id}>{c.companyInfo?.companyName}</option>
                  ))}
                </select>
              </div>
              <Input label="Branch Name" icon={MapPin} value={newBranch.name} onChange={e => setNewBranch({...newBranch, name: e.target.value})} required placeholder="e.g., Downtown Office" />
              <Input label="Location" icon={MapPin} value={newBranch.location} onChange={e => setNewBranch({...newBranch, location: e.target.value})} required placeholder="e.g., New York, NY" />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowBranchModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Create Branch</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeptModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Department</h2>
                <p className="text-sm text-gray-500">Add a new department to branch</p>
              </div>
              <button onClick={() => setShowDeptModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Company *</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map(c => (
                    <option key={c._id} value={c._id}>{c.companyInfo?.companyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Branch *</label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  disabled={!selectedCompanyId}
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} - {b.location}</option>
                  ))}
                </select>
              </div>
              <Input label="Department Name" icon={Layers} value={newDepartment.name} onChange={e => setNewDepartment({...newDepartment, name: e.target.value})} required placeholder="e.g., Engineering, Sales, HR" />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowDeptModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1">Create Department</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );

}

// Helper Input component for modals
const Input = ({ label, icon: Icon, value, onChange, required, placeholder, type = "text", error }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-semibold text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white ${
          error ? 'border-red-500' : 'border-gray-200'
        }`}
      />
    </div>
  </div>
);