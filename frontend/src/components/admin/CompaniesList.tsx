import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '@/api/axios';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companiesList');
       console.log('response at frontend',response)
      setCompanies(response.data); 
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
    
      </div>

      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{company.companyName}</td>
                  <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.isActive
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800' 
                    }`}
                  >
                    {company.isActive ? 'Active' : 'Inactive'}
                  </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{company.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{company.subscriptionPlan}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompaniesList;
