"use client";
import React, { useState } from 'react';
import { Search, Bell, FileText, Activity, ClipboardCheck, Menu, X } from 'lucide-react';
import FixedHeader from '../components/Header';

const ProjectStats = () => {
  const stats = [
    { title: "Total Projects", value: "5", icon: "📄" },
    { title: "Coming Projects", value: "8", icon: "🏗️" },
    { title: "Progress Projects", value: "1 Files", icon: "🔗" },
    { title: "Finished Projects", value: "3 Files", icon: "📋" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#4C3575] my-3 md:my-4 lg:my-6 text-white p-2 md:p-4 rounded-lg">
      <div className="flex items-center">
        <span className="text-2xl md:text-3xl mr-3">{icon}</span>
        <div>
          <h3 className="font-bold text-sm md:text-base">{title}</h3>
          <p className="text-sm md:text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectTable = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 lg:mb-6">
      <div className="p-3 md:p-4 lg:p-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">Project Information</h2>
        <input
          type="text"
          placeholder="Search projects..."
          className="border rounded px-3 py-2 w-full mb-3 md:mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date Start</th>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Deadline</th>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Leader</th>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-2 py-1 md:px-3 md:py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.title}>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap">{project.title}</td>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden sm:table-cell">{project.dateStart}</td>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden md:table-cell">{project.deadline}</td>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap hidden lg:table-cell">{project.leader}</td>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                      <div className="bg-purple-600 h-1.5 md:h-2 rounded-full" style={{ width: `${project.completion}%` }}></div>
                    </div>
                    <span className="text-xs md:text-sm text-gray-600">{project.completion}%</span>
                  </td>
                  <td className="px-2 py-1 md:px-3 md:py-2 whitespace-nowrap">
                    <span className={`px-1 md:px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full
                      ${project.stage === 'HIGH' ? 'bg-red-100 text-red-800' :
                        project.stage === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {project.stage}
                    </span>
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

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col overflow-hidden">
      <FixedHeader />
      <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

const CombinedDashboard = () => {
  const summaryCards = [
    { icon: FileText, title: 'Total Task', value: '5', color: 'bg-yellow-100 text-yellow-800' },
    { icon: ClipboardCheck, title: 'Completed Task', value: '3', color: 'bg-blue-100 text-blue-800' },
    { icon: Activity, title: 'Progress Task', value: '1', color: 'bg-teal-100 text-teal-800' },
  ];

  const projects = [
    { title: 'Hash 360', dateStart: '23-02-2021', deadline: '1 Month', leader: 'Peter', completion: 95, stage: 'MEDIUM' },
    { title: 'Talks Global', dateStart: '14-04-2021', deadline: '2 Month', leader: 'Benjamin', completion: 90, stage: 'MEDIUM' },
    { title: 'Sunfocus', dateStart: '16-03-2021', deadline: '2 Month', leader: 'Evan', completion: 97, stage: 'LOW' },
    { title: 'Kuppaaya', dateStart: '17-03-2021', deadline: '3 Month', leader: 'Connor', completion: 48, stage: 'MEDIUM' },
    { title: 'Sekenz', dateStart: '12-02-2021', deadline: '1 Month', leader: 'Colin', completion: 80, stage: 'LOW' },
    { title: 'Upgrad', dateStart: '12-02-2021', deadline: '1 Month', leader: 'Colin', completion: 90, stage: 'LOW' },

  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 mt-28 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {summaryCards.map((card, index) => (
            <div key={index} className={`flex items-center justify-between p-3 md:p-4 lg:p-6 rounded-lg ${card.color}`}>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-medium">{card.title}</span>
                <span className="text-lg md:text-xl lg:text-2xl font-bold">{card.value}</span>
              </div>
              <card.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            </div>
          ))}
        </div>
        <ProjectStats />
        <ProjectTable projects={projects} />
      </div>
    </DashboardLayout>
  );
};

export default CombinedDashboard;