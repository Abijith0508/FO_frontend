import React from 'react';
import { breadCrumbs } from '../styling';
import { Tooltip } from 'react-tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from 'lucide-react';

type Props = { 
  filters: string[]; 
  setFilters: any;
  className: string
};

const Heading = ({ filters, setFilters, className }: Props) => {
  return (
    <div className={`px-[5px] flex justify-center items-right w-full ${className}`}>
      <Crumbs filters={filters} setFilters={setFilters} />
    </div>
  );
};

type BreadCrumbProps = {
  filters: string[];
  setFilters: any;
};

function Crumbs({ filters, setFilters }: BreadCrumbProps) {
  return (
    <>
      <Tooltip id="BC-tooltip" float place="top"  className='z-10'/>
      <Breadcrumb className="cursor-pointer px-[2%] flex items-center justify-left gap-1 text-xl w-full">
        <BreadcrumbItem className="items-baseline" >
          <BreadcrumbLink onClick={() => setFilters([])} className={`${breadCrumbs} text-3xl`}>
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>

        {filters.map((filter, idx) => {
          const [group, value] = filter.split(':');
          return (
            <div className="flex items-center" key={idx}>
              <ChevronRight size={28} className="stroke-white/40" />
              <BreadcrumbItem
                data-tooltip-id="BC-tooltip"
                data-tooltip-content={group}
                data-tooltip-place="top"
                data-tooltip-float
                onClick={() => setFilters((prev: string[]) => prev.slice(0, idx+1))}
                className={`${breadCrumbs} text-xl`}
              >
                {convert(value)}
              </BreadcrumbItem>
            </div>
          );
        })}
      </Breadcrumb>
    </>
  );
}

function convert(s: string): string {
  return s
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default Heading;
