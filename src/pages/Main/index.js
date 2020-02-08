/* eslint-disable array-callback-return */
/* eslint-disable react/state-in-constructor */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';

// eslint-disable-next-line import/named
import { Form, SubmitButton, List, Erro } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  // carregar os dados no localstorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // salvar os dados do localstorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    // verifica input = repositórios cadastrados
    repositories.map(repository => {
      if (repository.name === newRepo) {
        this.setState({ er: true });
        throw e;
      }
    });

    const response = await api.get(`/repos/${newRepo}`).catch(() => {
      this.setState({ errors: true });
      throw e;
    });

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
      errors: false,
      er: false,
    });
  };

  render() {
    const { newRepo, repositories, loading, errors, er } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            required
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton>
            {loading && !errors ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        {er ? <Erro>Repositório já cadastrado!</Erro> : ''}
        {errors ? <Erro>Repositório inválido!</Erro> : ''}
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
