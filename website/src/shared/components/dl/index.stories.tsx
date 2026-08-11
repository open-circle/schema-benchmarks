import preview from "#storybook/preview";

const meta = preview.meta({
  title: "Components/Description List",
  render: () => (
    <>
      <p>Cryptids of Cornwall:</p>
      <dl>
        <div>
          <dt>Beast of Bodmin</dt>
          <dd>A large feline inhabiting Bodmin Moor.</dd>
        </div>
        <div>
          <dt>Morgawr</dt>
          <dd>A sea serpent.</dd>
        </div>
        <div>
          <dt>Owlman</dt>
          <dd>A giant owl-like creature.</dd>
        </div>
      </dl>
    </>
  ),
});

export const Default = meta.story();
