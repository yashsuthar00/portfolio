import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <header className="w-full p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Yash Suthar</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full space-y-6 md:space-y-8 text-center">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Portfolio Coming Soon</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
              I&apos;m currently working on something awesome. Stay tuned!
            </p>
          </div>
          
          <div className="w-16 md:w-24 h-1 bg-foreground/20 mx-auto rounded-full"></div>
          
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold">Meanwhile, you can find me here:</h3>
            <div className="flex justify-center flex-wrap gap-4 md:gap-5 py-2">
              <Link href="https://github.com/yashsuthar00" target="_blank" rel="noopener noreferrer" 
                className="transition-transform hover:scale-110">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">GitHub</span>
                </div>
              </Link>
              
              <Link href="https://www.linkedin.com/in/yashsuthar00" target="_blank" rel="noopener noreferrer"
                className="transition-transform hover:scale-110">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">LinkedIn</span>
                </div>
              </Link>
              
              <Link href="https://resume.yashsuthar.com" target="_blank" rel="noopener noreferrer"
                className="transition-transform hover:scale-110">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">Resume</span>
                </div>
              </Link>
              
              <Link href="https://leetcode.com/yashsuthar00" target="_blank" rel="noopener noreferrer"
                className="transition-transform hover:scale-110">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 17L10 11L4 5"></path>
                      <path d="M12 19L20 19"></path>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">LeetCode</span>
                </div>
              </Link>
              
              <Link href="https://colab-ide.vercel.app" target="_blank" rel="noopener noreferrer"
                className="transition-transform hover:scale-110">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-foreground/5 border border-foreground/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                      <line x1="12" y1="22" x2="12" y2="15.5"></line>
                      <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm">Projects</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="w-16 md:w-24 h-1 bg-foreground/20 mx-auto rounded-full"></div>
          
          <div className="pt-1 md:pt-2">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Get in touch</h3>
            <a 
              href="mailto:yashsuthar0309@gmail.com" 
              className="inline-flex items-center px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 text-sm md:text-base"
            >
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Contact Me
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-3 md:p-6">
        <div className="max-w-5xl mx-auto text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Yash Suthar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
