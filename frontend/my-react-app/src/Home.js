const Home = () => 
{
  const navigate = useNavigate(); // Step 2: Use useNavigate to create navigate function

  return (
    <div className="image-container">
      <img src="/Man2.jpg" alt="Man working on Car" />
      <div className="text-over-image">Welcome to ShopWizard!</div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {/* Step 3: Use navigate function on button click */}
        <button onClick={() => navigate('/appointments')} style={{position: 'absolute', top: '20%', left: '44%', transform: 'translate(0%, 0%)', padding: '10px 20px', fontSize: '32px' }}> Get Started </button>
      </div>
    </div>
  );
}

export default Home;