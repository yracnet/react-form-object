import styled from "styled-components";
export const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: min-content min-content min-content min-content min-content;
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
    grid-area: 1 / 1 / 2 / 4;
  }
  > .lastname {
    grid-area: 1 / 4 / 2 / 7;
  }
  > .gender {
    grid-area: 2 / 1 / 3 / 3;
  }
  > .age {
    grid-area: 2 / 3 / 3 / 5;
  }
  > .email {
    grid-area: 2 / 5 / 3 / 7;
  }
  > .guardian_name,
  > .guardianName {
    grid-area: 3 / 1 / 4 / 5;
  }
  > .guardian_phone,
  > .guardianPhone {
    grid-area: 3 / 5 / 4 / 7;
  }
  > .message {
    grid-area: 4 / 1 / 5 / 7;
  }
  > .actions {
    grid-area: 5 / 1 / 6 / 7;
  }
  > .debug {
    grid-area: 6 / 1 / 7 / 7;
    display: flex;
    > pre {
    }
  }
`;
