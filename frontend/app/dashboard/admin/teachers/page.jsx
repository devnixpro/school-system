"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { TeacherHeader } from '@/components/admin/teachers/TeacherHeader';
import { TeacherFilters } from '@/components/admin/teachers/TeacherFilter';
import { TeacherTable } from '@/components/admin/teachers/TeacherTable';
import { TeacherModal } from '@/components/admin/teachers/TeacherModal';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  
 const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    subject: '',
    qualification: '',
    phone: '',
    address: '',
    salary: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teachers');
      if (response.data?.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([
        { _id: '1', name: 'Sir Tariq', email: 'tariq@school.com', phone: '+92 300 1122334', department: 'Mathematics', qualification: 'M.Sc Math', isActive: true },
        { _id: '2', name: 'Ms. Ayesha', email: 'ayesha@school.com', phone: '+92 301 5566778', department: 'Computer Science', qualification: 'BSCS', isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleOpenAddModal = () => {
    setEditingTeacherId(null);
    setFormData({
      name: '',
      email: '',
      employeeId: '',
      subject: '',
      qualification: '',
      phone: '',
      address: '',
      salary: '',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher) => {
    setEditingTeacherId(teacher._id);
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      employeeId: teacher.employeeId || '',
      subject: teacher.subject || '',
      qualification: teacher.qualification || '',
      phone: teacher.phone || '',
      address: teacher.address || '',
      salary: teacher.salary || '',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitTeacher = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingTeacherId) {
        const response = await api.put(`/teachers/${editingTeacherId}`, formData);
        if (response.data?.success) {
          setIsModalOpen(false);
          fetchTeachers();
        }
      } else {
        const response = await api.post('/teachers', formData);
        if (response.data?.success) {
          setIsModalOpen(false);
          fetchTeachers();
        }
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const response = await api.delete(`/teachers/${teacherId}`);
      if (response.data?.success) {
        setTeachers((prev) => prev.filter((t) => t._id !== teacherId));
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert(error.response?.data?.message || 'Failed to delete teacher.');
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = (teacher.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || teacher.subject === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 bg-white min-h-screen p-6 rounded-2xl">
      <TeacherHeader onOpenModal={handleOpenAddModal} />

      <TeacherFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
      />

      <TeacherTable 
        teachers={filteredTeachers} 
        loading={loading} 
        onDelete={handleDeleteTeacher} 
        onEdit={handleOpenEditModal}
      />

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmitTeacher}
        submitting={submitting}
        errorMsg={errorMsg}
        isEditing={!!editingTeacherId}
      />
    </div>
  );
}