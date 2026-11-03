"use client";

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { StudentHeader } from '@/components/admin/students/StudentHeader';
import { StudentFilters } from '@/components/admin/students/StudentFilter';
import { StudentTable } from '@/components/admin/students/StudentTable';
import { AddStudentModal } from '@/components/admin/students/StudentModel';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null); // 👈 Track karne ke liye ke add ho raha hai ya edit

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    class: '10th Grade',
    section: 'A',
    password: 'Student@123',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      if (response.data?.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📝 Open Modal for Adding New Student
  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      class: '10th Grade',
      section: 'A',
      password: 'Student@123',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // 📝 Open Modal for Editing Existing Student
  const handleOpenEditModal = (student) => {
    setEditingStudentId(student._id);
    setFormData({
      name: student.name || '',
      rollNumber: student.rollNumber || '',
      email: student.email || '',
      phone: student.phone || '',
      class: student.class || '10th Grade',
      section: student.section || 'A',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  // 🚀 Unified Submit Handler (Handles both POST for Add & PUT for Update)
  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingStudentId) {
        // 👉 Update API (PUT)
        const response = await api.put(`/students/${editingStudentId}`, formData);
        if (response.data?.success) {
          setIsModalOpen(false);
          fetchStudents();
        }
      } else {
        // 👉 Add API (POST)
        const response = await api.post('/students', formData);
        if (response.data?.success) {
          setIsModalOpen(false);
          fetchStudents();
        }
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑️ Delete Student Function
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await api.delete(`/students/${studentId}`);
      if (response.data?.success) {
        setStudents((prev) => prev.filter((student) => student._id !== studentId));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert(error.response?.data?.message || 'Failed to delete student.');
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 bg-white min-h-screen p-6 rounded-2xl">
      {/* Add Modal Trigger */}
      <StudentHeader onOpenModal={handleOpenAddModal} />

      <StudentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Table with Delete & Edit Props */}
      <StudentTable 
        students={filteredStudents} 
        loading={loading} 
        onDelete={handleDeleteStudent} 
        onEdit={handleOpenEditModal}
      />

      {/* Modal supporting both Add and Edit */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmitStudent}
        submitting={submitting}
        errorMsg={errorMsg}
        isEditing={!!editingStudentId}
      />
    </div>
  );
}