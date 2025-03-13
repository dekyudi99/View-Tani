import React from 'react'
import Layouut from '../../Layouts/Layout'
import TopContainer from '@/Components/TopContainer'
import BottomContainer from '@/Components/BottomContainer'
import { Gauge } from 'lucide-react'
import { BarChart } from 'lucide-react'
import { Head } from '@inertiajs/react'

const Device = () => {
  return (
    <div>
        <Head title="Device" />
        <Layouut header="Device">
            <TopContainer icon={Gauge} title="Parangkat 1">
                {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="text-center">
                        <Gauge size={40} />
                        <p>Parameter {num}</p>
                    </div>
                ))}
            </TopContainer>

            <BottomContainer icon={BarChart} title="Grafik">
                {/* Isi Grafik */}
            </BottomContainer>
        </Layouut>
    </div>
  )
}

export default Device