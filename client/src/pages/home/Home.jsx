import React from 'react'
import Banner from '../../components/Banner';
import Categories from './Categories';
import SpecialProduct from './SpecialProduct';
import Testimonials from './Testimonials';
import OurServices from './OurServices';


const Home = () => {
  return (
    <div>
        <Banner />
        <Categories />
        <SpecialProduct />
        <Testimonials />
        <OurServices />
    </div>
  )
}

export default Home;