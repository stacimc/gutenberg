/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalGetBlockLabel as getBlockLabel,
	getBlockType,
} from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { VisuallyHidden } from '@wordpress/components';

import { last } from 'lodash';
import { Dropdown, Button } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TemplateDetails from '../../template-details';

function getBlockDisplayText( block ) {
	return block
		? getBlockLabel( getBlockType( block.name ), block.attributes )
		: null;
}

function useSecondaryText() {
	const {
		selectedBlock,
		getBlockParentsByBlockName,
		getBlockWithoutInnerBlocks,
	} = useSelect( ( select ) => {
		return {
			selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
			getBlockParentsByBlockName: select( 'core/block-editor' )
				.getBlockParentsByBlockName,
			getBlockWithoutInnerBlocks: select( 'core/block-editor' )
				.__unstableGetBlockWithoutInnerBlocks,
		};
	} );

	// Check if current block is a template part:
	const selectedBlockLabel =
		selectedBlock?.name === 'core/template-part'
			? getBlockDisplayText( selectedBlock )
			: null;

	if ( selectedBlockLabel ) {
		return {
			label: selectedBlockLabel,
			isActive: true,
		};
	}

	// Check if an ancestor of the current block is a template part:
	const templatePartParents = !! selectedBlock
		? getBlockParentsByBlockName(
				selectedBlock?.clientId,
				'core/template-part'
		  )
		: [];

	if ( templatePartParents.length ) {
		// templatePartParents is in order from top to bottom, so the closest
		// parent is at the end.
		const closestParent = getBlockWithoutInnerBlocks(
			last( templatePartParents )
		);
		return {
			label: getBlockDisplayText( closestParent ),
			isActive: true,
		};
	}

	return {};
}

export default function DocumentActions( { template } ) {
	const documentTitle = template?.slug;
	const { label, isActive } = useSecondaryText();

	// Title is active when there is no secondary item, or when the secondary
	// item is inactive.
	const isTitleActive = ! label?.length || ! isActive;

	// The title ref is passed to the popover as the anchorRef so that the
	// dropdown is centered over the whole title area rather than just one
	// part of it.
	const titleRef = useRef();

	return (
		<div
			className={ classnames( 'edit-site-document-actions', {
				'has-secondary-label': !! label,
			} ) }
		>
			{ documentTitle ? (
				<>
					<div ref={ titleRef }>
						<h1 className="edit-site-document-actions__title-wrapper">
							<VisuallyHidden>
								{ __( 'Edit template:' ) }
							</VisuallyHidden>
							<div
								className={ classnames(
									'edit-site-document-actions__title',
									{
										'is-active': isTitleActive,
										'is-secondary-title-active': isActive,
									}
								) }
							>
								{ documentTitle }
							</div>
						</h1>

						{ ! isActive && (
							<Dropdown
								popoverProps={ { anchorRef: titleRef.current } }
								position="bottom center"
								renderToggle={ ( { isOpen, onToggle } ) => (
									<Button
										className="edit-site-document-actions__get-info"
										icon={ chevronDown }
										aria-expanded={ isOpen }
										aria-haspopup="true"
										onClick={ onToggle }
										label={ __( 'Show template details' ) }
									/>
								) }
								renderContent={ () => (
									<TemplateDetails template={ template } />
								) }
							/>
						) }
					</div>
					<div
						className={ classnames(
							'edit-site-document-actions__secondary-item',
							{
								'is-secondary-title-active': isActive,
							}
						) }
					>
						{ label ?? '' }
					</div>
				</>
			) : (
				__( 'Loading…' )
			) }
		</div>
	);
}
