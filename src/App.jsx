import BotonNotificaciones from './components/BotonNotificaciones';
import ChatCondominio from './components/ChatCondominio';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* 1. Barra de navegación simple para el botón */}
      <nav style={{ 
        padding: '10px 20px', 
        backgroundColor: '#2c3e50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Residencial 2026</h1>
        
        {/* Aquí colocamos tu nuevo componente de notificaciones */}
        <BotonNotificaciones />
      </nav>

      {/* 2. Tu chat que ya funciona */}
      <div style={{ paddingTop: '20px' }}>
        <ChatCondominio />
      </div>

    </div>
  );
}

export default App;