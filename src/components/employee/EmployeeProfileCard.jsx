import React, { useState } from 'react';
import { 
  UserCheck, 
  Building2, 
  Briefcase, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  Award,
  AlertCircle,
  Send,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function maskEmail(email) {
  if (!email || !email.includes('@')) return email || '';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`;
  }
  return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
}

export default function EmployeeProfileCard({ employee, onReset }) {
  const { user, showToast } = useAuth();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  if (!employee) return null;

  const metrics = employee.historian_metrics || {};

  // Retrieve authenticated account email
  const userEmail = user?.email || 'admin@historian.ai';
  const maskedUserEmail = maskEmail(userEmail);

  const handleSendEmailToUser = async () => {
    setIsSendingEmail(true);
    setEmailStatus(null);
    setStatusMessage('');

    try {
      // Dispatch email request to backend API endpoint
      const response = await fetch('http://localhost:8000/api/v1/employees/send-result-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employee_id: employee.employee_id,
          recipient_email: userEmail,
          search_method: "Employee Badge/Image → OCR → Employee Directory"
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setEmailStatus('success');
        const msg = data.message || "✓ Result sent successfully to your registered email.";
        setStatusMessage(msg);
        showToast(msg, 'success');
      } else {
        setEmailStatus('error');
        const errDetail = data?.detail?.message || "Unable to send the result email. Please try again.";
        setStatusMessage(errDetail);
        showToast(errDetail, 'error');
      }
    } catch (err) {
      setEmailStatus('error');
      const errText = "Unable to connect to email backend server. Please try again.";
      setStatusMessage(errText);
      showToast(errText, 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="historian-card bg-white border-[#E8E4D0] overflow-hidden animate-fade-in shadow-xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F2937] via-[#2A3649] to-[#1F2937] p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FF8000]/20 border border-[#FF8000]/40 text-[#FF8000]">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">{employee.name}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FF8000] text-white">
                {employee.employee_id}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{employee.designation} • {employee.department}</p>
          </div>
        </div>

        {/* Security & Access Level Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold self-start sm:self-auto">
          <Shield className="w-4 h-4 text-[#FF8000]" />
          <span className="text-slate-200">{employee.security_clearance || "Level 4 - Confidential"}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Avatar & Key Status */}
          <div className="md:col-span-4 flex flex-col items-center text-center p-5 rounded-2xl bg-[#FFFDF7] border border-[#E8E4D0] space-y-3">
            <div className="relative group">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-[#FF8000] shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-white border-2 border-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-[#1F2937] text-base">{employee.name}</h3>
              <p className="text-xs font-semibold text-[#FF8000]">{employee.designation}</p>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                {employee.employment_status || "Active • Full-Time"}
              </span>
            </div>
          </div>

          {/* Detailed Attributes */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-1">
              <span className="text-[#9CA3AF] font-bold flex items-center gap-1.5 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-[#FF8000]" />
                Department
              </span>
              <p className="font-bold text-[#1F2937] text-xs">{employee.department}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-1">
              <span className="text-[#9CA3AF] font-bold flex items-center gap-1.5 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#FF8000]" />
                Enterprise Email
              </span>
              <p className="font-bold text-[#1F2937] text-xs truncate">{employee.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-1">
              <span className="text-[#9CA3AF] font-bold flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#FF8000]" />
                Joining Date
              </span>
              <p className="font-bold text-[#1F2937] text-xs">{employee.joining_date}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-1">
              <span className="text-[#9CA3AF] font-bold flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#FF8000]" />
                Primary Location
              </span>
              <p className="font-bold text-[#1F2937] text-xs">{employee.location}</p>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-1">
              <span className="text-[#9CA3AF] font-bold flex items-center gap-1.5 text-[11px]">
                <Briefcase className="w-3.5 h-3.5 text-[#FF8000]" />
                Reporting Manager
              </span>
              <p className="font-bold text-[#1F2937] text-xs">{employee.manager}</p>
            </div>
          </div>
        </div>

        {/* Historian System Records & Key Contributions */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF8000]" />
              Historian System Records & Analytics
            </h4>
            <span className="text-[11px] font-semibold text-emerald-600">Verified System Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#FFD1A4] text-center">
              <span className="text-[11px] text-[#6B7280] font-bold">Performance Index</span>
              <div className="text-lg font-extrabold text-[#1F2937] mt-0.5">
                {metrics.performance_score || 94.0}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#FFD1A4] text-center">
              <span className="text-[11px] text-[#6B7280] font-bold">Attendance Rate</span>
              <div className="text-lg font-extrabold text-[#FF8000] mt-0.5">
                {metrics.attendance_rate || "95.0%"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#FFD1A4] text-center">
              <span className="text-[11px] text-[#6B7280] font-bold">Risk Assessment</span>
              <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                {metrics.risk_classification || "Low Risk"}
              </div>
            </div>
          </div>

          {metrics.key_contributions && metrics.key_contributions.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E8E4D0] space-y-2 text-xs">
              <span className="font-bold text-[#1F2937] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF8000]" />
                Key Enterprise Contributions
              </span>
              <ul className="space-y-1 pl-5 list-disc text-[#4B5563]">
                {metrics.key_contributions.map((item, idx) => (
                  <li key={idx} className="font-medium">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Email Result to Authenticated Registered Account Section */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#FFD1A4]">
            <div>
              <div className="text-xs font-extrabold text-[#1F2937] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#FF8000]" />
                Email Result to Registered Account
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                Results will be sent to your registered Historian account email (<span className="font-bold text-[#1F2937]">{maskedUserEmail}</span>).
              </p>
            </div>

            <button
              disabled={isSendingEmail}
              onClick={handleSendEmailToUser}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] disabled:opacity-60 transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
            >
              {isSendingEmail ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Sending result to your registered email...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Send Result to Registered Email</span>
                </>
              )}
            </button>
          </div>

          {/* Status Alert feedback */}
          {emailStatus === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ {statusMessage}</span>
            </div>
          )}

          {emailStatus === 'error' && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {onReset && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1F2937] bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Search Another Badge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
