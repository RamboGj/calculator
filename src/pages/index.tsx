import { useContext, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

import 'rc-slider/assets/index.css';
import React from 'react';
import { api } from '../services/api';
import styles from './styles.module.scss';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// TODO: fetch from API: https://www.linkyouweb.com.br/api/integration/courriers/companies
const transpotadoras = [
  "Atual Cargas",
  "Azul",
  "B2Log",
  "Braspress",
  "Bristot Rocha Transportes",
  "Carriers",
  "Correios",
  "DBA Express",
  "Daytona Express",
  "Direcional",
  "Dlog",
  "Elohim",
  "Expresso São Miguel",
  "FSR/TransSD Transporte",
  "Jadlog",
  "Jamef",
  "Lafe Express",
  "Nowlog",
  "OnTime",
  "Pacífico",
  "Patrus",
  "Plimor",
  "PotSpeed",
  "Rede Sul",
  "Rodomaxlog",
  "Rodonaves",
  "Rodoê",
  "Sunorte Transportes",
  "TNT Mercúrio",
  "TSV Logística",
  "TW Transportes",
  "Total Express",
  "Transoliveira Transportes"
]

export default function Calculator() {
  const [contTransportadoras, setContTransportadora] = useState(0);
  const [transportadoraName, setTransportadoraName] = useState([]);
  const [numPedidos, setNumPedidos] = useState(500);
  const [numPedidosApi, setNumPedidosApi] = useState(500);
  const [valor, setValor] = useState(0);
  const [valorPedido, setValorPedido] = useState(0);
  const minPedidos = 0;
  const maxPedidos = 5000;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const classes = useStyles();
  const theme = useTheme();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChange = (event) => {
    setContTransportadora(event.target.value.length);
    setTransportadoraName(event.target.value);
  };

  useEffect(() => {
    if (numPedidos > 0 && contTransportadoras > 0) {
      api.get(`pricing/tracking?monthlyOrders=${numPedidosApi}&courrierCompanies=${contTransportadoras}`)
        .then(response => {
          setValor(response.data.montlhyCost.toFixed(2));
          setValorPedido(response.data.orderCost.toFixed(2));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [contTransportadoras, numPedidosApi]);

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.infoPedidos}>
        <header>
          <img width="40px" height="40px" src="/chaingreen.png" alt="LinkYou" />
        </header>
        <FormControl className={styles.formControl}>
          <span className={styles.numTransportadoras}>{contTransportadoras} {contTransportadoras == 1 ? ('Transportadora') : ('Transportadoras')}</span>
          <Select
            multiple
            value={transportadoraName}
            onChange={handleChange}
            input={<Input className={styles.multiSelect} />}
            renderValue={(selected: any) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {transpotadoras.map((name) => (
              <MenuItem key={name} value={name} style={getStyles(name, transportadoraName, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <span className={styles.numPedidos}>{numPedidos} pedidos mensais</span>

        <div className={styles.pedidos}>
          <div className={styles.sliderContainer}>
            <Slider
              trackStyle={{ backgroundColor: '#fff' }}
              railStyle={{ backgroundColor: '#777' }}
              handleStyle={{ borderColor: '#94aa44', borderWidth: 4 }}
              className={styles.slider}
              step={50}
              min={minPedidos}
              max={maxPedidos}
              value={numPedidos}
              onChange={val => setNumPedidos(val)}
              onAfterChange={val => setNumPedidosApi(val)}
            />
          </div>
          <span>{minPedidos}</span>
          <span>{maxPedidos}</span>
        </div>
        <div className={styles.costFinalContainer}>
          <span className={styles.costFinalLabel}>
            Investimento
          </span>
          <div className="break"></div>
          <span className={styles.costFinal}>
            R$ {valor} mensal
          </span>
          <span className={styles.costFinal}>
            (R$ {valorPedido} por pedido)
          </span>
        </div>
      </div>
    </div >
  );
}
