'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EventArchive } from '@/lib/types';
import { 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  Users, 
  MapPin, 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export default function AdminArchiveManager() {
  const [archives, setArchives] = useState<EventArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<EventArchive | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGeo, setUploadingGeo] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<EventArchive>>({
    original_serial_number: '',
    event_name: '',
    slug: '',
    resource_person: '',
    resource_person_name: '',
    resource_person_designation: '',
    event_coordinators: '',
    event_date_original: '',
    event_date_parsed: '',
    photo_url: '',
    geo_tag: '',
    academic_year: '2025-2026',
    source_document: '2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx',
    notes: '',
  });

  const loadArchives = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/archives');
      if (res.ok) {
        const data = await res.json();
        setArchives(data.archives || []);
      }
    } catch (err) {
      console.error('Failed to load archives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, []);

  const openCreateModal = () => {
    setEditingArchive(null);
    setFormData({
      original_serial_number: (archives.length + 1).toString(),
      event_name: '',
      slug: '',
      resource_person: '',
      resource_person_name: '',
      resource_person_designation: '',
      event_coordinators: '',
      event_date_original: '',
      event_date_parsed: '',
      photo_url: '',
      geo_tag: '',
      academic_year: '2025-2026',
      source_document: '2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx',
      notes: '',
    });
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EventArchive) => {
    setEditingArchive(item);
    setFormData({ ...item });
    setStatusMsg(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'photo_url' | 'geo_tag') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGeo = targetField === 'geo_tag';
    if (isGeo) setUploadingGeo(true);
    else setUploadingPhoto(true);

    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({
          ...prev,
          [targetField]: result.url,
        }));
        setStatusMsg({ type: 'success', text: `${isGeo ? 'Geo-tag proof' : 'Photo'} uploaded successfully!` });
      } else {
        setStatusMsg({ type: 'error', text: 'Upload failed. Only JPG, PNG, and WebP are allowed.' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatusMsg({ type: 'error', text: 'Upload request failed.' });
    } finally {
      if (isGeo) setUploadingGeo(false);
      else setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!formData.event_name?.trim() || !formData.event_date_original?.trim()) {
      setStatusMsg({ type: 'error', text: 'Event Name and Event Date are required.' });
      return;
    }

    try {
      if (editingArchive) {
        // Update
        const res = await fetch(`/api/admin/archives/${editingArchive.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setStatusMsg({ type: 'success', text: 'Archive record updated successfully!' });
          setTimeout(() => {
            setIsModalOpen(false);
            loadArchives();
          }, 600);
        } else {
          const err = await res.json();
          setStatusMsg({ type: 'error', text: err.error || 'Failed to update record.' });
        }
      } else {
        // Create
        const res = await fetch('/api/admin/archives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setStatusMsg({ type: 'success', text: 'New archive record added successfully!' });
          setTimeout(() => {
            setIsModalOpen(false);
            loadArchives();
          }, 600);
        } else {
          const err = await res.json();
          setStatusMsg({ type: 'error', text: err.error || 'Failed to create record.' });
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred while saving.' });
    }
  };

  const handleDelete = async (item: EventArchive) => {
    if (!window.confirm(`Are you sure you want to delete historical record: "${item.event_name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/archives/${item.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadArchives();
      } else {
        alert('Failed to delete archive record.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete request failed.');
    }
  };

  // Filter computation
  const filteredArchives = archives.filter((a) => {
    if (yearFilter !== 'all') {
      const matches = a.event_date_original.includes(yearFilter) || a.event_date_parsed?.startsWith(yearFilter);
      if (!matches) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matches = 
        a.event_name.toLowerCase().includes(q) ||
        a.resource_person.toLowerCase().includes(q) ||
        a.event_coordinators.toLowerCase().includes(q) ||
        a.original_serial_number.toLowerCase().includes(q) ||
        a.event_date_original.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#F0E8D4] shadow-spatial-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C99A27] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Department Historical Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] mt-1 font-sans">
            Manage AIML Event Archives
          </h2>
          <p className="text-xs text-[#77736A] mt-0.5">
            Preserve, verify, and update historical departmental activities from authoritative consolidated records.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFE99A] hover:bg-[#E7B83F] text-[#252525] font-black text-xs shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Archive Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E8D4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77736A]" />
          <input
            type="text"
            placeholder="Search archive records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-medium text-[#252525] focus:outline-none focus:border-[#E7B83F]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            aria-label="Filter records by Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] text-xs font-bold text-[#252525] focus:outline-none focus:border-[#E7B83F]"
          >
            <option value="all">All Years</option>
            <option value="2025">Year 2025</option>
            <option value="2026">Year 2026</option>
          </select>

          <span className="text-xs text-[#77736A] font-medium whitespace-nowrap">
            Showing <strong className="text-[#252525]">{filteredArchives.length}</strong> of {archives.length} records
          </span>
        </div>
      </div>

      {/* Archives Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-6 h-6 border-3 border-[#E7B83F] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-[#77736A] font-semibold">Loading archive records...</p>
        </div>
      ) : filteredArchives.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-[#F0E8D4] p-6">
          <BookOpen className="w-10 h-10 text-[#C99A27]/50 mx-auto mb-2" />
          <p className="text-xs font-bold text-[#252525]">No archive records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#F0E8D4] bg-white shadow-spatial-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9E8] border-b border-[#F0E8D4] text-[#252525] font-black uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-14">S.No</th>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4 w-28">Date</th>
                <th className="py-3 px-4">Resource Person</th>
                <th className="py-3 px-4">Coordinators</th>
                <th className="py-3 px-4 w-20 text-center">Photo</th>
                <th className="py-3 px-4 w-20 text-center">Geo Tag</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8D4]/60">
              {filteredArchives.map((archive) => (
                <tr key={archive.id} className="hover:bg-[#FFFDF5] transition-colors">
                  <td className="py-3.5 px-4 font-black text-[#252525]">
                    {archive.original_serial_number}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#252525] max-w-xs">
                    <div className="line-clamp-2">{archive.event_name}</div>
                    <span className="text-[10px] text-[#77736A] font-normal block mt-0.5">
                      Slug: /{archive.slug}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#C99A27] font-bold whitespace-nowrap">
                    {archive.event_date_original}
                  </td>
                  <td className="py-3.5 px-4 text-[#77736A] max-w-xs whitespace-pre-line">
                    {archive.resource_person || <span className="italic text-gray-400">None</span>}
                  </td>
                  <td className="py-3.5 px-4 text-[#77736A] max-w-xs whitespace-pre-line font-medium">
                    {archive.event_coordinators || <span className="italic text-gray-400">None</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {archive.photo_url ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px] italic">Missing</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {archive.geo_tag ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        <MapPin className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px] italic">Missing</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/event-archives/${archive.slug}`}
                        target="_blank"
                        title="View Public Webpage"
                        className="p-1.5 rounded-lg text-[#77736A] hover:text-[#C99A27] hover:bg-[#FFF9E8] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(archive)}
                        title="Edit Historical Record"
                        className="p-1.5 rounded-lg text-[#77736A] hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(archive)}
                        title="Delete Record"
                        className="p-1.5 rounded-lg text-[#77736A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#F0E8D4] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E8D4]/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C99A27]" />
                <h3 className="text-base font-black text-[#252525]">
                  {editingArchive ? 'Edit Historical Archive Record' : 'Add New Historical Archive Record'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#77736A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#252525] mb-1">Original S.No</label>
                  <input
                    type="text"
                    value={formData.original_serial_number || ''}
                    onChange={(e) => setFormData({ ...formData, original_serial_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                    placeholder="e.g. 1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#252525] mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academic_year || '2025-2026'}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#252525] mb-1">Event Name (Exact Original)</label>
                <input
                  type="text"
                  required
                  value={formData.event_name || ''}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                  placeholder="Enter exact event title"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#252525] mb-1">Original Date</label>
                  <input
                    type="text"
                    required
                    value={formData.event_date_original || ''}
                    onChange={(e) => setFormData({ ...formData, event_date_original: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                    placeholder="e.g. 28.07.2025"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#252525] mb-1">Machine Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={formData.event_date_parsed || ''}
                    onChange={(e) => setFormData({ ...formData, event_date_parsed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#252525] mb-1">Resource Person (with Designation/Company)</label>
                <textarea
                  rows={2}
                  value={formData.resource_person || ''}
                  onChange={(e) => setFormData({ ...formData, resource_person: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                  placeholder="e.g. Mr. Gowtham B&#10;CBOT SOLUTIONS Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block font-bold text-[#252525] mb-1">Event Coordinators</label>
                <textarea
                  rows={2}
                  value={formData.event_coordinators || ''}
                  onChange={(e) => setFormData({ ...formData, event_coordinators: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] font-medium"
                  placeholder="e.g. Dr. Sathesshkumar D.&#10;Ms. Anupriya K"
                />
              </div>

              {/* Photo Upload / URL */}
              <div className="p-3 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] space-y-2">
                <label className="block font-bold text-[#252525]">Event Photo / Poster</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.photo_url || ''}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="/archives/image2.png"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#F0E8D4] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FFE99A] hover:bg-[#E7B83F] font-bold text-[#252525] shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'photo_url')}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
              </div>

              {/* Geo Tag Upload / URL */}
              <div className="p-3 rounded-xl bg-[#FFFDF5] border border-[#F0E8D4] space-y-2">
                <label className="block font-bold text-[#252525]">GPS Geo Tag Photo / Evidence</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.geo_tag || ''}
                    onChange={(e) => setFormData({ ...formData, geo_tag: e.target.value })}
                    placeholder="/archives/image3.png"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#F0E8D4] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FFE99A] hover:bg-[#E7B83F] font-bold text-[#252525] shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploadingGeo ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'geo_tag')}
                      disabled={uploadingGeo}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E8D4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-[#252525]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFE99A] hover:bg-[#E7B83F] font-black text-[#252525] shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
