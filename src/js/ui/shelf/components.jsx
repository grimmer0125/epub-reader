import _ from 'lodash'
import React from 'react'
import { Menu, Sidebar, Icon, Popup, Input, Label } from 'semantic-ui-react'

export const ShelfMenu = ({ onClickShowSettings, openBookFiles }) => (
	<Sidebar as={Menu} direction='top' visible inverted fluid>
		<Popup inverted
			trigger={
				<Menu.Item>
					<Icon name='folder open' />
					<label className='full-size'>
						<input type='file' multiple className='hide' accept='.epub' onChange={(e) => {
							const input = e.currentTarget
								, files = _.map(input.files, (f) => f.path)
							input.value = null
							openBookFiles(files)
						}} />
					</label>
				</Menu.Item>
			}
			content='Open EPub files'
		/>
		<Popup inverted
			trigger={
				<Menu.Item>
					<Icon name='filter' />
					<Label color='blue'>
						Filter
						<Icon name='close' />
					</Label>
				</Menu.Item>
			}
			on='click'
		>
			<Input icon={<Icon name='close' inverted circular link />} placeholder='Search...' />
		</Popup>

		<Menu.Item className='title-middle-bar'>
			<label>EPub Reader</label>
		</Menu.Item>

		<Menu.Menu position='right'>
			<Popup inverted
				trigger={
					<Menu.Item>
						<Label color='brown'>
							TITLE
							<Label.Detail>
								<Icon name='sort content descending' />
							</Label.Detail>
						</Label>
						<Icon name='dropdown' />
					</Menu.Item>
				}
				content={
					<Menu vertical inverted>
						<Menu.Item>
							<Menu.Header>Sort by:</Menu.Header>
							<Menu.Menu>
								<Menu.Item active>
									Title
									<Icon name='check' />
								</Menu.Item>
								<Menu.Item>
									Last Read
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>
						<Menu.Item>
							<Menu.Menu>
								<Menu.Item>
									Ascending
									<Icon name='sort content ascending' />
								</Menu.Item>
								<Menu.Item active>
									Descending
									<Icon name='sort content descending' />
								</Menu.Item>
							</Menu.Menu>
						</Menu.Item>
					</Menu>
				}
				on='click'
			/>
			<Popup inverted
				trigger={
					<Menu.Item onClick={onClickShowSettings}>
						<Icon name='settings' />
					</Menu.Item>
				}
				content='Settings'
			/>
		</Menu.Menu>
	</Sidebar>
)

export const ShelfBody = ({ customMargin, viewMargin, bookMargin, bookCovers, onClickOpenBook }) => (
	<div id='books-shelf' style={ customMargin ? { paddingLeft: viewMargin, paddingRight: viewMargin, } : {} }>
	{
		bookCovers.map((book = {}, index) => (
			<div key={index}
				className='book-cover'
				onClick={() => onClickOpenBook(book)}
				style={ customMargin ? { marginLeft: bookMargin/2, marginRight: bookMargin/2, } : {} }
				>
				<label className='book-title' title={book.fileName}>{book.title}</label>
			</div>
		))
	}
	</div>
)

const exported = {
	ShelfMenu,
	ShelfBody,
}

export default exported
