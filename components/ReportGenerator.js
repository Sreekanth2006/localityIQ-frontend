'use client'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export const generatePDFReport = (locality) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Colors
    const primaryColor = [99, 102, 241] // Indigo
    const successColor = [16, 185, 129]
    const warningColor = [245, 158, 11]
    const dangerColor = [239, 68, 68]

    // Get recommendation color
    const getRecColor = (rec) => {
        switch (rec) {
            case 'buy': return successColor
            case 'hold': return warningColor
            case 'avoid': return dangerColor
            default: return warningColor
        }
    }

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return successColor
            case 'moderate': return warningColor
            case 'poor': return dangerColor
            default: return [150, 150, 150]
        }
    }

    const metricLabels = {
        airQuality: 'Air Quality',
        water: 'Water Supply',
        power: 'Power Reliability',
        schools: 'School Quality',
        safety: 'Safety Score',
        growth: 'Growth Potential',
        hospitals: 'Healthcare Access',
        traffic: 'Traffic Score'
    }

    const metricIcons = {
        airQuality: '🌫️',
        water: '💧',
        power: '⚡',
        schools: '🏫',
        safety: '🚔',
        growth: '🚧',
        hospitals: '🏥',
        traffic: '🚦'
    }

    let yPos = 20

    // ========== HEADER ==========
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, pageWidth, 45, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('LocalityIQ', 20, 25)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Neighbourhood Intelligence Report', 20, 35)

    // Date
    doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })}`, pageWidth - 20, 35, { align: 'right' })

    yPos = 60

    // ========== LOCALITY NAME & SCORE ==========
    doc.setTextColor(30, 30, 40)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(locality.name, 20, yPos)

    yPos += 8
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 110)
    doc.text(locality.area, 20, yPos)

    // Total Score Box
    const scoreBoxX = pageWidth - 55
    const scoreBoxY = 52

    doc.setFillColor(245, 245, 250)
    doc.roundedRect(scoreBoxX, scoreBoxY, 40, 30, 3, 3, 'F')

    doc.setTextColor(...primaryColor)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text(`${locality.totalScore}`, scoreBoxX + 20, scoreBoxY + 18, { align: 'center' })

    doc.setFontSize(8)
    doc.setTextColor(100, 100, 110)
    doc.text('out of 100', scoreBoxX + 20, scoreBoxY + 26, { align: 'center' })

    yPos += 12

    // Recommendation badge
    const recColor = getRecColor(locality.recommendation)
    doc.setFillColor(...recColor)
    doc.roundedRect(20, yPos, 50, 10, 2, 2, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    const recText = locality.recommendation === 'buy' ? 'STRONG BUY' :
        locality.recommendation === 'hold' ? 'HOLD' : 'AVOID'
    doc.text(recText, 45, yPos + 7, { align: 'center' })

    yPos += 20

    // Price Range
    doc.setTextColor(30, 30, 40)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Price Range:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...primaryColor)
    doc.text(locality.priceRange, 55, yPos)

    yPos += 15

    // ========== METRICS TABLE ==========
    doc.setTextColor(30, 30, 40)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed Metrics', 20, yPos)

    yPos += 8

    // Build table data
    const tableData = Object.entries(locality.metrics).map(([key, metric]) => [
        `${metricLabels[key]}`,
        `${metric.score}/100`,
        metric.label,
        metric.details.slice(0, 50) + (metric.details.length > 50 ? '...' : '')
    ])

    doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Score', 'Status', 'Details']],
        body: tableData,
        margin: { left: 20, right: 20 },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [248, 248, 252]
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 35 },
            1: { cellWidth: 22, halign: 'center' },
            2: { cellWidth: 25 },
            3: { cellWidth: 'auto' }
        },
        didDrawCell: (data) => {
            // Color the score column based on value
            if (data.column.index === 1 && data.row.section === 'body') {
                const score = parseInt(data.cell.raw)
                if (score >= 75) {
                    doc.setTextColor(...successColor)
                } else if (score >= 60) {
                    doc.setTextColor(...warningColor)
                } else {
                    doc.setTextColor(...dangerColor)
                }
            }
        }
    })

    yPos = doc.lastAutoTable.finalY + 15

    // ========== SCORE BAR CHART ==========
    doc.setTextColor(30, 30, 40)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Score Overview', 20, yPos)

    yPos += 10

    // Draw horizontal bar chart
    const metrics = Object.entries(locality.metrics)
    const barHeight = 8
    const maxBarWidth = 100
    const labelWidth = 45

    metrics.forEach(([key, metric], index) => {
        const barY = yPos + (index * 14)

        // Label
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 70)
        doc.text(metricLabels[key], 20, barY + 6)

        // Background bar
        doc.setFillColor(230, 230, 235)
        doc.roundedRect(20 + labelWidth, barY, maxBarWidth, barHeight, 1, 1, 'F')

        // Score bar
        const barWidth = (metric.score / 100) * maxBarWidth
        const barColor = getStatusColor(metric.status)
        doc.setFillColor(...barColor)
        doc.roundedRect(20 + labelWidth, barY, barWidth, barHeight, 1, 1, 'F')

        // Score value
        doc.setTextColor(30, 30, 40)
        doc.setFont('helvetica', 'bold')
        doc.text(`${metric.score}`, 20 + labelWidth + maxBarWidth + 5, barY + 6)
    })

    yPos += metrics.length * 14 + 15

    // ========== HIGHLIGHTS ==========
    if (locality.highlights && locality.highlights.length > 0) {
        doc.setTextColor(30, 30, 40)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Key Highlights', 20, yPos)

        yPos += 8

        locality.highlights.forEach((highlight, index) => {
            doc.setFillColor(240, 240, 250)
            doc.roundedRect(20, yPos + (index * 12), pageWidth - 40, 10, 2, 2, 'F')

            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(60, 60, 80)
            doc.text(`✓  ${highlight}`, 25, yPos + (index * 12) + 7)
        })

        yPos += locality.highlights.length * 12 + 10
    }

    // ========== FOOTER ==========
    const footerY = doc.internal.pageSize.getHeight() - 15

    doc.setDrawColor(220, 220, 230)
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)

    doc.setFontSize(8)
    doc.setTextColor(120, 120, 130)
    doc.text('This report is generated by LocalityIQ - Neighbourhood Intelligence Platform', 20, footerY)
    doc.text('Data is for informational purposes only. Please verify independently before making decisions.', 20, footerY + 5)

    // Save PDF
    doc.save(`LocalityIQ-${locality.name.replace(/\s+/g, '-')}-Report.pdf`)
}

export default function ReportGenerator({ locality }) {
    const handleDownload = () => {
        generatePDFReport(locality)
    }

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            📄 Download PDF Report
        </button>
    )
}
