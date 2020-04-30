import React, { Component } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  Label,
  Input,
  Button,
  Jumbotron,
  Spinner
} from 'reactstrap';

import {Typeahead} from 'react-bootstrap-typeahead'; 

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      persons:[],
      municipios:[],
      nomeCandidato:"",
      nomeMunicipio:"",
      cargo: "",
      anoEleicao:"",
      showLoad:"none"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(){    
    this.request();      
  }

  request = async () => {

    this.setState({ showLoad:"inline-block" });      
    var anoELeicaoTratado = this.state.anoEleicao;
    if(anoELeicaoTratado === undefined || anoELeicaoTratado === ""){
      anoELeicaoTratado = "0";
    }
        
    await axios.get(`https://api-bizu.herokuapp.com/coleta/candidaturas?nomeMunicipio=${this.state.nomeMunicipio}&nomeCandidato=${this.state.nomeCandidato}&anoEleicao=${anoELeicaoTratado}&cargo=${this.state.cargo}`)
    .then(res => {
      const persons = res.data;
      this.setState({ persons });      
      this.setState({ showLoad:"none" });      
    })      

    await axios.get(`https://api-bizu.herokuapp.com/coleta/municipios`)
    .then(res => {
      const municipios = res.data;
      this.setState({ municipios });
    })      
    console.log(this.state);
  }  

  handleChange = (event) => this.setState({nomeMunicipio: event.target.value});
  handleChangeCandidato = (event) => {        
    this.setState({nomeCandidato: event.target.value})
    console.log(this.state);
  };
  handleChangeAnoEleicao = (event) => {        
    this.setState({anoEleicao: event.target.value})
    console.log(this.state);
  };

  handleSubmit = (event) => {
    event.preventDefault()
    this.request();
  };
  
  mapper = (objeto) => objeto.valor !== undefined ? objeto.valor : undefined;
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
          <Col>
            <Card>              
              <CardBody>
                <Jumbotron>
                  <h1 className="display-3">BIZU</h1>
                  <p className="lead">Conheça todos os candidatos que um dia foram bloqueados pela Justiça Eleitoral no Estado do Ceará</p>
                  <hr className="my-2" />
                  <p>Dados coletados do portal da transparência do TSE.</p>                                    
                </Jumbotron>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader>
                Filtros
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit} >
                  <Row>
                    <Col md="3" >
                      <Label htmlFor="municipio">Municipio</Label>
                      <Typeahead
                        id="municipio"
                        placeholder="Selecione um município"
                        onChange={(selected) => {
                          this.setState({nomeMunicipio : selected })
                        }}
                        options={this.state.municipios}
                      />                      
                    </Col>
                    <Col md="3" >
                      <Label htmlFor="municipio">Cargo</Label>
                      <Typeahead
                        id="cargo"
                        placeholder="Selecione um cargo"
                        onChange={(selected) => {
                          this.setState({cargo : selected })
                        }}
                        options={['PREFEITO','VEREADOR','GOVERNADOR','SENADOR','DEPUTADO FEDERAL','DEPUTADO ESTADUAL']}
                      />                      
                    </Col>
                    <Col md="3">
                      <Label htmlFor="candidato">Candidato</Label>
                      <Input type="text" id="candidato" placeholder="nome do Candidato"                    
                        value={this.state.nomeCandidato} 
                        onChange={this.handleChangeCandidato}
                      />
                    </Col>
                    <Col md="3">
                      <Label htmlFor="anoEleicao">Ano da Eleição  </Label>
                      <Input type="text" id="anoEleicao" placeholder="Ano da Eleicao"                    
                        value={this.state.anoEleicao} 
                        onChange={this.handleChangeAnoEleicao}
                      />
                    </Col>                    
                    
                  </Row>                                    
                  <hr></hr>
                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Filtrar</Button>
                </Form>
                <Spinner color="danger" style={{display: this.state.showLoad, position: "relative",left: "50%" }} />
              </CardBody>
            </Card>
          </Col>        
        </Row>        
        <Row>
        { 
          this.state.persons.map(person => 
            <Col xs="12" sm="6" md="4" key={person.id} >
            <Card>
              <CardHeader>                
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <b>Ano:</b>
                      </td>                                           
                      <td>
                        {person.anoEleicao}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Municipio:</b>
                      </td>                                           
                      <td>
                        {person.municipioEleicao}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Cargo:</b>
                      </td>                                           
                      <td>
                        {person.cargoEleicao}
                      </td>
                    </tr>
                  </tbody>                 
                </table>                              
              </CardHeader>
              <CardBody>               
                <Row>
                  <Col md="12">
                    <b>{person.nomeCandidatoNaUrna}</b>             
                    <hr></hr>
                  </Col>                   
                </Row>
                <Row>
                  <Col md="6">                    
                    <img src={person.urlFoto} width="100%" />
                    <hr></hr>
                    <Card>
                      <CardHeader>
                        Bens declarados
                      </CardHeader>
                      <CardBody>
                        { this.formata(person.bens.map(this.mapper).reduce(this.reducer,0).toFixed(2))}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card>
                      <CardHeader>
                        Motivo Cassação
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
