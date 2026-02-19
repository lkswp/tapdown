export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background/60 py-8 backdrop-blur-xl">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} TapDown. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-4">
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
    )
}
