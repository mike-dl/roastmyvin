export default function DieselRepairFooter() {
    return (
        <footer
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: 'auto',
        padding: '2rem',
        backgroundColor: '#ffb81ccc',
        color: 'black',
      }}
    >
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Diesel Repair: Built for Techs Who Don't Get Roasted 🔥
          </h2>
          <p className="font-bold mb-4">
          Stop wasting money on outdated tech with incomplete information. Join Diesel Repair today and see for yourself 
          what modern software can do.</p>
          <p className="font-bold text-lg">
          Sign up in April and get <span className="font-extrabold">3x FREE credits</span> for your first month!
          </p>
          <div className="mt-6">
            <a
              href="https://app.dieselrepair.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-neutral"
            >
              Sign Up Free Today →
            </a>
          </div>
        </div>
      </footer>
    )
  }