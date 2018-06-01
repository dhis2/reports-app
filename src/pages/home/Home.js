import React from 'react';
import MenuGrid from '../../components/grid-menu/GridMenu';

import { sections } from '../sections.conf';

const Home = () => (
    <MenuGrid sections={sections} />
);

export default Home;
