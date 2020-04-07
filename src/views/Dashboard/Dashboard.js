import React, { Component } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from 'reactstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      persons:[]
    };
  }

  async componentDidMount(){
    
    await axios.get('http://192.168.15.21:8080/coleta/candidaturas')
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
      })      
      console.log(this.state);
      
  }

  mapper = (objeto) => objeto.valor;
  reducer = (accumulator, currentValue) =>  accumulator + currentValue;
  formata = (valor) => {
    if (valor !== 0 && !valor) {
        throw new TypeError('You should pass a valid argument');
    }

    const numero = Number(valor)
        .toFixed(2)
        .split('.');

    numero[0] = `R$ ${numero[0].split(/(?=(?:...)*$)/).join('.')}`;

    return numero.join(',');
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
        { 
          this.state.persons.map(person => 
            <Col xs="12" sm="6" md="4" key={person.id} >
            <Card>
              <CardHeader>
              ({person.anoEleicao}) - {person.nomeCandidato} - {person.cargoEleicao} - {person.municipioEleicao}
              </CardHeader>
              <CardBody>               
                <Row>
                  <Col md="6">
                    <img src={person.urlFoto} width="100%" />
                    <hr></hr>
                    <Card>
                      <CardHeader>
                        Bens declarados
                      </CardHeader>
                      <CardBody>
                        { this.formata(person.bens.map(this.mapper).reduce(this.reducer).toFixed(2))}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card>
                      <CardHeader>
                        Cassações
                      </CardHeader>
                      <CardBody>                        
                        { person.cassacoes.map((cassacao, index) => <li key={index} >{cassacao.motivoCanssacao}</li>)}                     
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                
              </CardBody>
            </Card>
          </Col>
          )
        }          
          </Row>
        </div>
    );
  }
}

export default Dashboard;
