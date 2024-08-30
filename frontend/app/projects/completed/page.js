'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FixedHeader from '../../components/Header'
import CreateProjectForm from '../../projectslist/CreateProjectForm';
import ProjectCard from '../../projectslist/page';
import EmployeeInvitationDialog from '../../members/page';

function ProjectDashboard() {
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects(filter);
  }, [filter]);

  const fetchProjects = async (status) => {
    try {
      const url = status === 'All' 
        ? 'http://localhost:8000/projects/' 
        : `http://localhost:8000/projects/filtered/?status=${status}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const handleProjectClick = (project) => {
    router.push(`/project/${project.id}`);
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setIsProjectCreated(true);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map(project => (project.id === updatedProject.id ? updatedProject : project)));
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedProject = await response.json();
      setProjects(projects.map(project => (project.id === projectId ? updatedProject : project)));
      
      // Refetch projects if the current filter is not 'All'
      if (filter !== 'All') {
        fetchProjects(filter);
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleFilterClick = (status) => {
    setFilter(status);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <FixedHeader />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Projects</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto">
          <div className="flex flex-wrap mb-4 sm:mb-0">
            {['All', 'Started', 'Approval', 'Completed'].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 mr-2 mb-2 sm:mb-0 text-sm ${
                  filter === status
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600'
                }`}
                onClick={() => handleFilterClick(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            className="bg-purple-900 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
            onClick={() => setShowForm(true)}
          >
            + Create Project
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <CreateProjectForm
            onClose={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            onProjectCreated={handleProjectCreated}
            onProjectUpdated={handleProjectUpdated}
            initialProject={editingProject}
          />
        </div>
      )}

      {showInvitation && (
        <EmployeeInvitationDialog onClose={() => setShowInvitation(false)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onAddMember={() => setShowInvitation(true)}
            onClick={() => handleProjectClick(project)}
            onEdit={handleProjectEdit}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteProject}
            className={isProjectCreated ? 'animate-fade-in' : ''}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectDashboard;