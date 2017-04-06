import _ from 'lodash'
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import fontManager from 'font-manager'

let cachedFonts = [], updatedCache = false, fetchingFonts = false

function mergeFonts(fonts) {
	return _.uniq(fonts.map(({family}) => family)).sort((f1, f2) => f1 < f2 ? -1 : 1)
}

function fetchFonts(cb) {
	if (updatedCache) {
		setTimeout(() => {
			cb && cb(cachedFonts)
		}, 100)
		return
	}

	if (fetchingFonts) {
		setTimeout(() => {
			fetchFonts(cb)
		}, 100)
		return
	}

	fetchingFonts = true
	fontManager.getAvailableFonts((fonts) => {
		cachedFonts = mergeFonts(fonts).map((f) => ({ key: f, value: f, text: f }))
		fetchingFonts = false
		updatedCache = true
		cb && cb(cachedFonts)
	})
}

export class FontPicker extends Component {

	constructor(props) {
		super(props)
		this.state = {
			fonts: updatedCache ? cachedFonts : _.filter([props.fontFamily]).map((f) => ({ key: f, value: f, text: f })),
			selected: props.fontFamily,
			loading: !updatedCache,
		}
		if (!updatedCache) {
			fetchFonts((fonts) => {
				this.setState({fonts, loading: false})
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.color) {
			this.setState({selected: nextProps.fontFamily})
		}
	}

	onChanged(selected) {
		const { onChange = null } = this.props
			, oldSelected = this.state.selected
		if (selected === oldSelected)
			return
		this.setState({ selected })
		onChange && onChange(selected)
	}

	render() {
		const { fonts, selected, loading } = this.state
		return (
		<Dropdown search selection fluid
			options={fonts}
			loading={loading}
			value={selected}
			onChange={(e, data) => this.onChanged(data.value)} />
		)
	}
}