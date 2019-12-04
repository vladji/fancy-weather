import './scss/style.css';
import Layout from './components/View';
import Controller from './components/Controller';

const layout = new Layout();
layout.controlsRender();

const control = new Controller(layout);
control.start();
