export default function DieselRepairFooter() {
  return (
    <footer className="footer w-full max-w-[900px] mx-auto p-4 bg-black/70 text-black box-border">
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          Diesel Repair: Don't let your repair software roast you! 🔥
        </h2>
        <p className="font-bold text-md">
          Stop wasting money on outdated tech with incomplete information. Join Diesel Repair today and see for yourself
          what modern software can do.
        </p>

        <div className="mt-4 mb-4">
          <a
            href="https://app-repair.diesellaptops.com#/sign-up?utm_source=website&utm_medium=footer_link&utm_campaign=roastmyvin"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-neutral animated-glow"
          >
            🔥 Sign Up Free Today →
          </a>
        </div>

        <p className="font-bold text-md">
          Every Diesel Repair account has full access to our VIN Decoder, fault code database, parts-cross reference and more!
          Grab your account now!
        </p>

        {/* App Store Links */}
        <div className="flex gap-4 mt-2 mb-4">
          <a
            href="https://apps.apple.com/gb/app/diesel-repair-mobile/id6599861426?uo=2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="appstore.svg"
              alt="Download on the App Store"
              className="h-12"
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.diesellaptops.mobilerepair&hl=en_US&pli=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="googleplay.svg"
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>
        </div>

        <p className="text-xs mt-10">
          PS. Want our VIN decoder to power your website? <a className="info p-1" href="https://www.diesellaptops.com/pages/diesel-laptops-apis">Get in touch</a> and let us know! <br /><br />
          &copy; 2025 <a href="https://diesellaptops.com">Diesel Laptops</a>. Information is for entertainment purposes only.
          This site does not store VINs or collect any personal information.
        </p>
      </div>
    </footer>
  )
}
