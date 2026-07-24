import { monthFormatter } from "@schema-benchmarks/utils";
import { lightFormat } from "date-fns/fp";

import { MdSymbol } from "#/shared/components/symbol";
import preview from "#storybook/preview";

import { Timeline, TimelineItem } from ".";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const meta = preview.meta({
  title: "Components/Timeline",
  render: () => (
    <Timeline>
      <TimelineItem date={yesterday} title="Timeline Item 1">
        Content for timeline item 1
      </TimelineItem>
      <TimelineItem
        date={new Date()}
        title="Timeline Item 2"
        icon={<MdSymbol>speed</MdSymbol>}
        subtitle="Subtitle for timeline item 2"
      >
        Content for timeline item 2
      </TimelineItem>
      <TimelineItem
        range={[yesterday, tomorrow]}
        formatters={{
          normal: monthFormatter,
          code: lightFormat("yyyy-MM"),
        }}
        title="Timeline Item 3"
        subtitle="Subtitle for timeline item 3"
        icon={<MdSymbol>check_circle</MdSymbol>}
      >
        Content for timeline item 3
      </TimelineItem>
    </Timeline>
  ),
});

export default meta;

export const Default = meta.story();
