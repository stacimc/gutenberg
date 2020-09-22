/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Icon, closeSmall, search as searchIcon } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../../button';
import {
	MenuTitleHeadingUI,
	MenuTitleSearchUI,
	MenuTitleUI,
} from '../styles/navigation-styles';
import TextControl from '../../text-control';

export default function NavigationMenuTitle( {
	hasSearch,
	search,
	setSearch,
	title,
} ) {
	const [ isSearching, setIsSearching ] = useState( false );

	if ( ! title ) {
		return null;
	}

	const onSearchClose = () => {
		setSearch( '' );
		setIsSearching( false );
	};

	/* translators: placeholder for sidebar search box. %s: menu title */
	const placeholder = sprintf( __( 'Search in %s' ), title );

	return (
		<MenuTitleUI>
			{ ! isSearching && (
				<MenuTitleHeadingUI
					as="h2"
					className="components-navigation__menu-title"
					variant="title.small"
				>
					{ title }

					{ hasSearch && (
						<Button
							isSmall
							isTertiary
							onClick={ () => setIsSearching( true ) }
						>
							<Icon icon={ searchIcon } />
						</Button>
					) }
				</MenuTitleHeadingUI>
			) }

			{ isSearching && (
				<MenuTitleSearchUI>
					<Icon icon={ searchIcon } />

					<TextControl
						autocomplete="off"
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus
						onChange={ ( value ) => setSearch( value ) }
						placeholder={ placeholder }
						value={ search }
					/>

					<Button isSmall isTertiary onClick={ onSearchClose }>
						<Icon icon={ closeSmall } />
					</Button>
				</MenuTitleSearchUI>
			) }
		</MenuTitleUI>
	);
}
