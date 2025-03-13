import React from 'react'
import Layouut from '../../Layouts/Layout'
import TopContainer from '@/Components/TopContainer'
import BottomContainer from '@/Components/BottomContainer'

const Dashboard = () => {
  return (
    <div>
        <Layouut>
            <TopContainer>
                {/* Parameter Perangkat */}
            </TopContainer>

            <BottomContainer>
                {/* Isi Grafik */}
            </BottomContainer>
        </Layouut>
    </div>
  )
}

export default Dashboard
