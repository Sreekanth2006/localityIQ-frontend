'use client'

import {
  Wind,
  Droplets,
  Zap,
  GraduationCap,
  Shield,
  TrendingUp,
  Stethoscope,
  Car,
  Target
} from 'lucide-react'
import Card from '@/components/ui/Card'

export default function Features() {
  const features = [
    { icon: Wind, label: 'Air Quality', desc: 'Real-time AQI data' },
    { icon: Droplets, label: 'Water Supply', desc: 'Availability & quality' },
    { icon: Zap, label: 'Power Reliability', desc: 'Outage frequency' },
    { icon: GraduationCap, label: 'School Quality', desc: 'Ratings & distance' },
    { icon: Shield, label: 'Safety Score', desc: 'Crime & security' },
    { icon: TrendingUp, label: 'Growth Potential', desc: 'Infrastructure plans' },
    { icon: Stethoscope, label: 'Healthcare', desc: 'Hospital access' },
    { icon: Car, label: 'Traffic', desc: 'Commute times' }
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 font-display">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">
            What We <span className="text-primary-600">Measure</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto font-ui font-medium">
            Comprehensive analysis of all factors that matter for your perfect neighbourhood
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                variant="primary"
                padding="lg"
                hover
                className="text-center animate-fade-in border border-neutral-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2 font-display">{feature.label}</h3>
                <p className="text-sm text-neutral-500 font-ui font-medium leading-relaxed">{feature.desc}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
