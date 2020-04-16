import ReactGA from 'react-ga';

export default function analytics(event: string, message: string) {
  console.info(event, message);

  return ReactGA.event({
    category: event,
    action: message,
  });
}
