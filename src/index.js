import './styles/style.css';
import Layout from './components/View';
import Controller from './components/Controller';
import Model from './components/Model';
import icon from './components/lib/skycons';
import Speech from './components/Speech';

const layout = new Layout(icon);
Layout.setHead();
layout.controlsRender();

const model = new Model(layout);

const speech = new Speech(layout);

const control = new Controller(layout, model, speech);
control.initStorage();
