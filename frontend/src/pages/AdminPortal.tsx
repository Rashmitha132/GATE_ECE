import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, CheckCircle2, UserX, AlertTriangle, Trash2 } from 'lucide-react';
import api from '../services/api';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      // Show only students and faculty in the approval/governance roster
      setUsers(res.data.filter((u: any) => u.role !== 'admin'));
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/auth/users/${id}`, { status: 'approved' });
      fetchUsers();
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200 text-center space-y-3">
        <ShieldCheck className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-stone-900">Administrator Access Required</h3>
        <p className="text-xs text-stone-500">
          Only authorized GSSSIETW institutional administrators can access verification controls.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="bg-gradient-to-r from-[#500713] via-[#701a2b] to-[#8e2137] text-white rounded-2xl p-6 shadow-md">
        <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">
          INSTITUTIONAL ADMINISTRATION
        </span>
        <h1 className="text-2xl font-serif font-bold">Account Approval & Role Governance</h1>
        <p className="text-xs text-rose-200 mt-1">
          Verify registered students and faculty before granting platform syllabus access.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
        <h3 className="font-serif font-bold text-sm text-stone-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#701a2b]" />
          <span>Pending Student & Faculty Approvals</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf7f5] text-stone-500 font-semibold border-b border-rose-100">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Institutional Email</th>
                <th className="py-3 px-4">USN / Contact Phone</th>
                <th className="py-3 px-4">Requested Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-rose-50/20">
                  <td className="py-3 px-4 font-semibold text-stone-900">{u.name}</td>
                  <td className="py-3 px-4 text-stone-600">{u.email}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {u.phone_number ? (
                      <span className="text-[#701a2b] font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        📞 {u.phone_number}
                      </span>
                    ) : (
                      <span className="text-stone-700 font-medium bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {u.usn || '—'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      u.role === 'faculty' ? 'bg-amber-50 text-amber-800' : 'bg-sky-50 text-sky-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      u.status === 'approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {u.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(u.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer inline-flex items-center gap-1"
                      title="Delete User"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
