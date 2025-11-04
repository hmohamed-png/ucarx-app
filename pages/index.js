import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qqnirnptzwxbokejbppj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbmlybnB0end4Ym9rZWpicHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDcyNTAsImV4cCI6MjA3NzQyMzI1MH0.Rq3JKP7XfGyhxplCc3XcwZBMGTF-lQZftcNazubEE-Q'
)

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setVehicles(data || [])
    setLoading(false)
  }

  async function addVehicle(vehicle) {
    const { error } = await supabase
      .from('vehicles')
      .insert([vehicle])
    
    if (!error) {
      alert('✅ Vehicle added successfully!')
      fetchVehicles()
      setScreen('home')
    } else {
      alert('❌ Error: ' + error.message)
    }
  }

  async function deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
    
    if (!error) {
      alert('✅ Vehicle deleted!')
      fetchVehicles()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Nav screen={screen} setScreen={setScreen} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {screen === 'home' && (
          <HomeScreen 
            vehicles={vehicles} 
            loading={loading} 
            onDelete={deleteVehicle}
            onAdd={() => setScreen('add')}
          />
        )}
        {screen === 'add' && (
          <AddScreen 
            onAdd={addVehicle} 
            onCancel={() => setScreen('home')} 
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

function Nav({ screen, setScreen }) {
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚗</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">UCarX</h1>
              <p className="text-xs text-blue-100 hidden sm:block">Car Management Platform</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={() => setScreen('home')}
              className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all ${
                screen === 'home' 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'hover:bg-white/20'
              }`}
            >
              <span className="hidden sm:inline">My Vehicles</span>
              <span className="sm:hidden">🏠</span>
            </button>
            <button 
              onClick={() => setScreen('add')}
              className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all ${
                screen === 'add' 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'hover:bg-white/20'
              }`}
            >
              <span className="hidden sm:inline">+ Add Vehicle</span>
              <span className="sm:hidden">➕</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HomeScreen({ vehicles, loading, onDelete, onAdd }) {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-6 text-gray-600 text-lg">Loading your vehicles...</p>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="text-8xl sm:text-9xl mb-8 animate-bounce">🚗</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">No Vehicles Yet</h2>
        <p className="text-gray-600 text-lg mb-8">Start managing your cars by adding your first vehicle</p>
        <button
          onClick={onAdd}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
        >
          ➕ Add Your First Vehicle
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            My Vehicles
          </h2>
          <p className="text-gray-600 mt-2">You have {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg px-6 py-3">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 h-48 flex items-center justify-center text-7xl">
              🚗
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {v.brand} {v.model}
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-semibold">{v.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🔢</span>
                  <div>
                    <p className="text-xs text-gray-500">Plate Number</p>
                    <p className="font-semibold">{v.plate_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="font-semibold">{(v.mileage || 0).toLocaleString()} km</p>
                  </div>
                </div>
                {v.color && (
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <p className="text-xs text-gray-500">Color</p>
                      <p className="font-semibold">{v.color}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t flex gap-2">
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  📋 Details
                </button>
                <button 
                  onClick={() => onDelete(v.id)}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all"
                  title="Delete vehicle"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddScreen({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plate_number: '',
    color: '',
    mileage: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.brand || !form.model || !form.plate_number) {
      alert('⚠️ Please fill in all required fields (Brand, Model, Plate Number)')
      return
    }
    onAdd(form)
  }

  const brands = [
    'Toyota', 'Hyundai', 'Nissan', 'Kia', 'Chevrolet', 
    'Ford', 'Honda', 'Mazda', 'BMW', 'Mercedes-Benz',
    'Audi', 'Volkswagen', 'Peugeot', 'Renault', 'Skoda'
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Add New Vehicle</h2>
        <p className="text-gray-600">Fill in the details of your vehicle</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            value={form.brand}
            onChange={e => setForm({...form, brand: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="">Select vehicle brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.model}
            onChange={e => setForm({...form, model: e.target.value})}
            placeholder="e.g., Corolla, Elantra, Civic"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.year}
              onChange={e => setForm({...form, year: parseInt(e.target.value)})}
              min="1990"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={form.color}
              onChange={e => setForm({...form, color: e.target.value})}
              placeholder="e.g., White, Black, Silver"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Plate Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.plate_number}
            onChange={e => setForm({...form, plate_number: e.target.value.toUpperCase()})}
            placeholder="ABC 1234"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Mileage (kilometers)
          </label>
          <input
            type="number"
            value={form.mileage}
            onChange={e => setForm({...form, mileage: parseInt(e.target.value) || 0})}
            min="0"
            placeholder="45000"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            ➕ Add Vehicle
          </button>
        </div>
      </form>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg font-semibold mb-2">🚗 UCarX - Car Management Platform</p>
        <p className="text-gray-400 text-sm">Built with Next.js & Supabase</p>
        <p className="text-gray-500 text-xs mt-4">© 2025 UCarX. All rights reserved.</p>
      </div>
    </footer>
  )
}
