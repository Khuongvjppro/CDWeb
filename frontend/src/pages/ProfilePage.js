import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";
import { User, Phone, MapPin, Mail, Shield, Calendar, Save, CheckCircle, AlertCircle } from "lucide-react";
import { VIETNAM_PROVINCES, getDistrictsByProvince, getWardsByDistrict } from "../components/checkout/checkoutData";

export default function ProfilePage() {
  const { user, updateUserInState } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "Hà Nội",
    district: "Quận Hoàn Kiếm",
    ward: "Phường Hàng Bạc",
    addressDetail: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [profileData, setProfileData] = useState(null);

  // Bộ phân tách chuỗi địa chỉ thông minh
  const parseAddressString = (addressStr) => {
    const result = {
      province: "Hà Nội",
      district: "Quận Hoàn Kiếm",
      ward: "Phường Hàng Bạc",
      addressDetail: ""
    };
    
    if (!addressStr) return result;
    
    // Xóa chữ "Việt Nam" thừa ở cuối nếu có
    let cleanAddress = addressStr.replace(/,?\s*Việt Nam\s*$/i, "").trim();
    const parts = cleanAddress.split(",").map(p => p.trim());
    
    // Nếu có định dạng chuẩn phân cách bởi dấu phẩy và tối thiểu 3 phần (Phường, Quận, Tỉnh)
    if (parts.length >= 3) {
      const prov = parts[parts.length - 1];
      const dist = parts[parts.length - 2];
      const wrd = parts[parts.length - 3];
      const detail = parts.slice(0, parts.length - 3).join(", ");
      
      result.province = prov;
      result.district = dist;
      result.ward = wrd;
      result.addressDetail = detail;
    } else {
      // Nếu địa chỉ viết tự do, coi như là địa chỉ chi tiết
      result.addressDetail = cleanAddress;
    }
    return result;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        const data = response.data;
        setProfileData(data);

        const parsed = parseAddressString(data.address);
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          province: parsed.province,
          district: parsed.district,
          ward: parsed.ward,
          addressDetail: parsed.addressDetail,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMsg("Không thể tải thông tin cá nhân. Vui lòng tải lại trang.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProvinceChange = (provinceName) => {
    const districts = getDistrictsByProvince(provinceName);
    const defaultDistrict = districts[0] || "";
    const wards = getWardsByDistrict(provinceName, defaultDistrict);
    const defaultWard = wards[0] || "";

    setFormData((prev) => ({
      ...prev,
      province: provinceName,
      district: defaultDistrict,
      ward: defaultWard,
    }));
  };

  const handleDistrictChange = (districtName) => {
    const wards = getWardsByDistrict(formData.province, districtName);
    const defaultWard = wards[0] || "";

    setFormData((prev) => ({
      ...prev,
      district: districtName,
      ward: defaultWard,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      handleProvinceChange(value);
    } else if (name === "district") {
      handleDistrictChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Ghép các trường phân cấp thành chuỗi địa chỉ hoàn chỉnh
    const concatenatedAddress = `${formData.addressDetail}, ${formData.ward}, ${formData.district}, ${formData.province}`;

    try {
      await authAPI.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        address: concatenatedAddress,
      });
      
      // Đồng bộ thông tin mới cập nhật vào Context của React
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        phone: formData.phone,
        address: concatenatedAddress,
      };
      updateUserInState(updatedUser);
      setSuccessMsg("Cập nhật thông tin cá nhân thành công! ✨");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.response?.data?.error || "Đã xảy ra lỗi khi cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#b55239] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-stone-500">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  const districts = getDistrictsByProvince(formData.province);
  const wards = getWardsByDistrict(formData.province, formData.district);
  const selectClass = "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5";

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#b55239]">Tài khoản</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#5a3e36]">Thông Tin Cá Nhân</h1>
          <p className="mt-2 text-sm text-stone-500">Quản lý thông tin cá nhân của bạn và định dạng địa chỉ nhận hàng phân cấp.</p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/45 p-6 sm:p-8 shadow-[0_20px_50px_rgba(90,62,54,0.06)] backdrop-blur-md">
          {successMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800 animate-in fade-in duration-300">
              <CheckCircle className="text-emerald-500 shrink-0" size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-800 animate-in fade-in duration-300">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-2">
              <div className="flex items-center gap-3 text-stone-600">
                <Mail size={16} className="text-stone-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Địa chỉ Email</span>
                  <span className="text-sm font-medium">{profileData?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-stone-600">
                <Shield size={16} className="text-stone-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Vai trò tài khoản</span>
                  <span className="text-sm font-semibold capitalize text-[#b55239]">
                    {profileData?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-stone-600 sm:col-span-2 border-t border-stone-200/50 pt-2.5 mt-1">
                <Calendar size={16} className="text-stone-400" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Thành viên từ ngày</span>
                  <span className="text-sm font-medium">{formatDate(profileData?.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div>
              <label className="block text-xs font-bold text-[#5a3e36]/70 uppercase tracking-wider mb-2">
                Họ và Tên
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-[#b55239] transition-colors">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a3e36]/70 uppercase tracking-wider mb-2">
                Số Điện Thoại
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-[#b55239] transition-colors">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5"
                />
              </div>
            </div>

            {/* Structured Address Dropdowns */}
            <div>
              <label className="block text-xs font-bold text-[#5a3e36]/70 uppercase tracking-wider mb-3">
                Địa Chỉ Giao Hàng Mặc Định
              </label>
              <div className="grid gap-4 rounded-2xl border border-stone-100 bg-stone-50/50 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Tỉnh / Thành phố</span>
                    <select name="province" value={formData.province} onChange={handleChange} className={selectClass}>
                      {VIETNAM_PROVINCES.map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Quận / Huyện</span>
                    <select name="district" value={formData.district} onChange={handleChange} className={selectClass}>
                      {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Phường / Xã</span>
                    <select name="ward" value={formData.ward} onChange={handleChange} className={selectClass}>
                      {wards.map((ward) => (
                        <option key={ward} value={ward}>{ward}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1.5 pl-1">Địa chỉ chi tiết (Số nhà, tên đường...)</span>
                  <div className="relative group">
                    <span className="absolute top-3.5 left-0 flex items-start pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-[#b55239] transition-colors">
                      <MapPin size={16} />
                    </span>
                    <textarea
                      name="addressDetail"
                      value={formData.addressDetail}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Nhập số nhà, tên đường, tên tòa nhà..."
                      className="w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm text-[#5a3e36] outline-none transition duration-300 focus:border-[#b55239] focus:ring-4 focus:ring-[#b55239]/5 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5a3e36] to-[#b55239] py-3.5 text-sm font-bold text-white shadow-md shadow-[#5a3e36]/10 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Đang lưu thay đổi...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
