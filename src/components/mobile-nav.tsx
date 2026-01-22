import { Link, useLocation } from 'react-router-dom'
import { Home, Droplet, Apple, Dumbbell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/water', icon: Droplet, label: 'Água' },
  { to: '/meals', icon: Apple, label: 'Refeições' },
  { to: '/workouts', icon: Dumbbell, label: 'Treinos' },
  { to: '/settings', icon: Settings, label: 'Config' }
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
