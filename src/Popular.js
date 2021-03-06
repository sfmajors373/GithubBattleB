import React from 'react';
import PropTypes from 'prop-types';
import api from './utils/api';
import Loading from './Loading';

// state
// lifecycle
// ui

function SelectLanguage (props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {languages.map(function (lang) {
        return (
          <li
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, lang)}
            key={lang}>
              {lang}
          </li>
        )
      })}
    </ul>
  )
}

function RepoGrid (props){
  return (
    <ul className='popularList'>
      {props.repos.map(function (repo, index) {
	return (
          <li key={repo.name} className='popularItem'>
            <div className='popularRank'>#{index + 1}</div>    
	    <ul className='spaceListItems'>
              <li>
	        <img
	          className='avatar'
	          src={repo.owner.avatar_url}
	          alt={'Avatar for ' + repo.owner.login} />
	      </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
	      <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })} 
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

SelectLanguage.propTypes = {
  selectedLanugage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount () {
    // AJAX request
    this.updateLanguage(this.state.selectedLanguage);
  }
  updateLanguage(lang) {
    this.setState(function () {
      return {
        selectedLanguage: lang,
	repos: null
      }
    });
    api.fetchPopularRepos(lang)
      .then(function (repos) {
        this.setState(function () {
	  return {
	    repos: repos
	  }
	})
      }.bind(this));
  }
  render() {
    return (
      <div>
	<SelectLanguage
	  selectedLanguage={this.state.selectedLanguage}
	  onSelect={this.updateLanguage}
	/>
	{!this.state.repos
	  ? <Loading />
	  : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

export default Popular;
