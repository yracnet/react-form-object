import styled from "styled-components";
export const ItemLayout = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  grid-template-rows: min-content min-content;
  gap: 1em 1em;

  &.failed .valid-feedback,
  &.success .valid-feedback,
  &.valid .valid-feedback {
    display: block !important;
  }
  &.failed .invalid-feedback,
  &.success .invalid-feedback,
  &.invalid .invalid-feedback {
    display: block !important;
  }

  > .name {
    grid-area: 1 / 1 / 2 / 2;
  }
  > .email {
    grid-area: 1 / 2 / 2 / 3;
  }
  > .actions {
    grid-area: 1 / 3 / 2 / 4;
  }
  > .debug {
    grid-area: 2 / 1 / 3 / 4;
  }
`;
