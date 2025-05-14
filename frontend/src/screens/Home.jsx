import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios.js';
import { FaPlus, FaUserFriends } from 'react-icons/fa';

const Home = () => {
  const {user} = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate()

  function createProject(e) {
    e.preventDefault();
    axios.post('/projects/create', {
      name: projectName,
    }).then((res) => {
      setProjects([...projects, res.data.project]);
      setIsModalOpen(false);
      setProjectName('');
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    axios.get('/projects/all').then((res) => {
      setProjects(res.data.projects);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <header className="w-full py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
          >
            <FaPlus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">No Projects</p>
            <p className="text-slate-500 mt-2">Create a new project to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project._id}
                onClick={() => navigate('/project', { state: project })}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-4">{project.name}</h2>
                <div className="flex items-center gap-2 text-slate-600">
                  <FaUserFriends className="h-5 w-5" />
                  <span>{project.users.length} Collaborators</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full p-3 rounded-lg bg-white text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;