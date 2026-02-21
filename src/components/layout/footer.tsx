export function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-background/40 py-12 backdrop-blur-2xl mt-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-medium">
                <p className="text-foreground/70 tracking-wide">&copy; {new Date().getFullYear()} TapDown. All rights reserved.</p>
                <div className="mt-6 flex justify-center gap-6">
                    <a href="#" className="hover:text-primary transition-colors duration-300">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors duration-300">Privacy Policy</a>
                </div>
            </div>
        </footer>
    )
}
