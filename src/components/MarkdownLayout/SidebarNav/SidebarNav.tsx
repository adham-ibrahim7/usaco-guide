import * as React from 'react';
import { ModuleInfo, ModuleLinkInfo } from '../../../models/module';
import ItemLink from './ItemLink';
import Accordion from './Accordion';
import MODULE_ORDERING, {
  Chapter,
  SECTION_LABELS,
  SECTIONS,
} from '../../../../content/ordering';
import { useContext, useState } from 'react';
import MarkdownLayoutContext from '../../../context/MarkdownLayoutContext';
import { SolutionInfo } from '../../../models/solution';
import SectionsDropdown from '../../SectionsDropdown';

export interface NavLinkGroup {
  label: string;
  children: ModuleLinkInfo[];
}

export const SidebarNav = () => {
  const { markdownLayoutInfo, sidebarLinks } = useContext(
    MarkdownLayoutContext
  );
  const [activeSection, setActiveSection] = useState(
    markdownLayoutInfo instanceof SolutionInfo
      ? 'general'
      : markdownLayoutInfo.section
  );

  const links: NavLinkGroup[] = React.useMemo(() => {
    return MODULE_ORDERING[activeSection].map((category: Chapter) => ({
      label: category.name,
      children: category.items.map(
        moduleID => sidebarLinks.find(link => link.id === moduleID) // lol O(n^2)?
      ),
    }));
  }, [activeSection, sidebarLinks]);

  return (
    <nav className="flex-grow bg-white dark:bg-dark-surface flex flex-col h-0">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-center my-4">
          <SectionsDropdown
            currentSection={activeSection}
            sidebarNav={true}
            onSelect={s => setActiveSection(s)}
          />
        </div>
      </div>
      <div className="flex-1 h-0 overflow-y-auto">
        {links.map(group => (
          <Accordion
            key={group.label}
            label={group.label}
            isActive={
              group.children.findIndex(x => x.id === markdownLayoutInfo.id) !==
              -1
            }
          >
            {group.children.map(link => (
              <ItemLink key={link.id} link={link} />
            ))}
          </Accordion>
        ))}
      </div>
    </nav>
  );
};
