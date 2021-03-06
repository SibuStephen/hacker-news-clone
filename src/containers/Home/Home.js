import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNews } from '../../actions/news'
import styles from './Home.css'
import baseSty from '../../styles/base.css'
import Loader from '../../components/Loader/Loader'
import { isEmpty,socialTime,getHost } from '../../utils'
import { Link } from 'react-router'

class Home extends Component {

	componentDidMount () {
		this.props.dispatch(fetchNews())
	}

	render () {
		document.title = 'Hacker News'
		const { newsList, dispatch, start, noMoreNews } = this.props
		let loader = <Loader />
		let list = null
		let moreStatus = false

		document.onscroll = function() {

			if(moreStatus) {
				return
			}
			else{
				moreStatus = (document.body.scrollTop >= document.body.offsetHeight - window.innerHeight - 200) ? true : false
				if(moreStatus){
					loader = <Loader />
					dispatch(fetchNews(start))
				}
			}
		}

		if(!isEmpty(newsList) ){
      //loader = moreStatus ? <Loader /> : null
      list = (
      	newsList.map(function (item,index) {
      		return (
      			<li key={item.id}>
      			<i>{index+1}</i>
      			<button>{item.score} <br/>{item.score > 1 ? 'points':'point'}</button>
      			<div className={styles.content}>
      			<h3><a href={item.url} target="_blank">{item.title}</a></h3>
      			<cite><a href={item.url} target="_blank">{getHost(item.url)}</a> <time>-- {socialTime(item.time)}</time></cite>
      			<div className={styles.actionArea}>
      			<a href={`https://hn.algolia.com/?query=${item.title}`} target="_blank"><span className={baseSty.iconClock}></span>past</a>
      			<a href={`https://www.google.com/search?q=${item.title}`} target="_blank"><span className={baseSty.iconLink}></span>web</a>
      			<a href="#"><span className={baseSty.iconBubble}></span>discuss</a>
      			<Link to={`/user/${item.by}`} className={styles.user}>@{item.by}</Link>
      			</div>
      			</div>
      			</li>
      			)
      	})
      	)
  }

  return (
  	<div className={styles.timeLine}>
  	<ul>{list}</ul>
  	{noMoreNews ? '':loader}
  	<div className={noMoreNews?styles.noMoreNews:''}>{noMoreNews?'No More News :)':''}</div>
  </div>
  )
}
}

function mapStateToProps(state) {
	return {
		newsList: state.newsList.newsList,
		start: state.newsList.start,
		noMoreNews: state.newsList.noMoreNews

	}
}

export default connect(mapStateToProps)(Home)
