import './scss/style.css';
import Layout from './components/View';
import Controller from './components/Controller';
import Model from './components/Model';

const layout = new Layout();
layout.controlsRender();

const model = new Model(layout);

const control = new Controller(layout, model);
control.start();
