import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  ScanLine, 
  User, 
  Building2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { processBadgeImage } from '../../services/badgeOcrService';
import { searchEmployeeDirectory } from '../../data/employeeData';
import EmployeeProfileCard from './EmployeeProfileCard';

export default function EmployeeBadgeSearchModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepText, setStepText] = useState('');
  const [ocrResult, setOcrResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    setErrorMessage(null);
    setSelectedEmployee(null);
    setSearchResults([]);
    setOcrResult(null);

    // 1. Client Validation: Format & Size
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      setErrorMessage("Invalid image format. Please upload a JPG, JPEG, PNG, or WEBP employee badge.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file size exceeds the 10MB limit. Please upload a smaller image.");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Step 1: Uploading
      setStepText("Uploading badge image...");
      await new Promise(r => setTimeout(r, 300));

      // Step 2: Processing OCR
      setStepText("Extracting printed text via OCR...");
      const ocrRes = await processBadgeImage(file);
      setPreviewUrl(ocrRes.previewUrl);
      setOcrResult(ocrRes);
      await new Promise(r => setTimeout(r, 400));

      // Step 3: Detecting ID
      const empId = ocrRes.extractedData.employeeId;
      setStepText(`Employee ID detected: ${empId || 'Extracting parameters...'}`);
      await new Promise(r => setTimeout(r, 400));

      // Step 4: Directory Search
      setStepText("Searching Historian directory...");
      let matches = searchEmployeeDirectory(empId);

      if (matches.length === 0 && ocrRes.extractedData.name) {
        matches = searchEmployeeDirectory(ocrRes.extractedData.name);
      }

      setSearchResults(matches);

      if (matches.length === 1) {
        setSelectedEmployee(matches[0]);
      } else if (matches.length > 1) {
        setSelectedEmployee(null);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to process badge image. Please try again.");
    } finally {
      setIsProcessing(false);
      setStepText("");
    }
  };

  const resetSearch = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOcrResult(null);
    setSearchResults([]);
    setSelectedEmployee(null);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#E8E4D0]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#FFFDF7] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF0E0] text-[#FF8000] border border-[#FFD1A4]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2937] tracking-tight">
                Search Employee by Badge Image
              </h2>
              <p className="text-xs font-medium text-[#6B7280]">
                Extract badge OCR details and query Historian's authorized employee directory.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#9CA3AF] hover:text-[#1F2937] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          {/* Upload Dropzone (When no preview/result) */}
          {!previewUrl && !isProcessing && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3
                ${dragActive 
                  ? 'border-[#FF8000] bg-[#FFF0E0]/50 scale-[1.01]' 
                  : 'border-[#E8E4D0] bg-[#FFFDF7] hover:border-[#FFD1A4] hover:bg-[#FFFDF7]'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="p-4 rounded-2xl bg-white border border-[#E8E4D0] shadow-sm text-[#FF8000]">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-extrabold text-[#1F2937] text-sm">
                  Drag & Drop Employee Badge Image
                </h3>
                <p className="text-xs text-[#6B7280] font-medium mt-1">
                  Supports JPG, JPEG, PNG, WEBP (Max size: 10MB)
                </p>
              </div>

              <button
                type="button"
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-xs cursor-pointer"
              >
                Upload Employee Badge
              </button>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="p-8 text-center space-y-5 bg-[#FFFDF7] rounded-2xl border border-[#E8E4D0]">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF8000]/20 border-t-[#FF8000] animate-spin" />
                <ScanLine className="w-8 h-8 text-[#FF8000] animate-pulse" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-[#1F2937]">{stepText}</h3>
                <p className="text-xs text-[#6B7280] font-medium mt-1">
                  Analyzing badge layout and running OCR text extraction algorithm...
                </p>
              </div>
            </div>
          )}

          {/* Processing Completed: OCR Details & Search Results */}
          {!isProcessing && previewUrl && (
            <div className="space-y-6">
              {/* Badge Preview & OCR Extracted Summary Header */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-[#FFFDF7] border border-[#E8E4D0] items-center">
                <div className="sm:col-span-4 relative group rounded-xl overflow-hidden border border-[#E8E4D0] bg-slate-100 max-h-36 flex items-center justify-center">
                  <img src={previewUrl} alt="Badge Preview" className="max-h-36 object-contain" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                    Badge Preview
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-[#1F2937] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#FF8000]" />
                      Extracted Badge OCR Text
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      Confidence: {ocrResult?.ocrConfidence || 96.5}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#9CA3AF] font-bold">Employee ID:</span>
                      <p className="font-extrabold text-[#FF8000]">{ocrResult?.extractedData?.employeeId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF] font-bold">Printed Name:</span>
                      <p className="font-bold text-[#1F2937]">{ocrResult?.extractedData?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF] font-bold">Department:</span>
                      <p className="font-bold text-[#1F2937]">{ocrResult?.extractedData?.department || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF] font-bold">Designation:</span>
                      <p className="font-bold text-[#1F2937]">{ocrResult?.extractedData?.designation || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Match Employee Profile Result */}
              {selectedEmployee && (
                <EmployeeProfileCard employee={selectedEmployee} onReset={resetSearch} />
              )}

              {/* Multiple Matches Selectable List */}
              {!selectedEmployee && searchResults.length > 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2937]">
                      Multiple Matches Found ({searchResults.length})
                    </h3>
                    <span className="text-xs text-[#6B7280]">Select employee to view full profile</span>
                  </div>

                  <div className="space-y-2.5">
                    {searchResults.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="p-4 rounded-xl border border-[#E8E4D0] bg-white hover:border-[#FF8000] hover:bg-[#FFFDF7] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover border border-[#E8E4D0]" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-[#1F2937] text-xs group-hover:text-[#FF8000] transition-colors">{emp.name}</h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{emp.employee_id}</span>
                            </div>
                            <p className="text-[11px] text-[#6B7280] font-medium">{emp.designation} • {emp.department}</p>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#FF8000] transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State: No Matching Employee Found */}
              {!selectedEmployee && searchResults.length === 0 && (
                <div className="p-8 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1F2937]">No matching employee found.</h3>
                    <p className="text-xs text-[#6B7280] font-medium mt-1 max-w-md mx-auto">
                      The extracted Employee ID <span className="font-bold text-[#1F2937]">({ocrResult?.extractedData?.employeeId})</span> does not match any active employee records in Historian's directory.
                    </p>
                  </div>
                  <button
                    onClick={resetSearch}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] transition-all cursor-pointer shadow-xs"
                  >
                    Upload Another Badge
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
